import "server-only";

import type { BlogPost } from "@/lib/pi-types";
import { defaultLocale, isSupportedLocale, type SiteLocale } from "@/lib/i18n";
import { getSql } from "@/lib/db";
import type {
  StorefrontBlogPostInput,
  StorefrontBlogPostRecord,
} from "@/lib/storefront-blog-types";

export const STOREFRONT_BLOG_POSTS_TAG = "storefront-blog-posts";

type BlogPostRow = {
  body_json: unknown;
  category: string;
  cover_image_url: string;
  cover_note: string;
  created_at: string;
  excerpt: string;
  id: string;
  is_published: boolean;
  locale: string;
  published_at: string;
  read_time: string;
  slug: string;
  title: string;
  updated_at: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLocale(value: unknown): SiteLocale {
  const candidate = typeof value === "string" ? value : "";
  return isSupportedLocale(candidate) ? candidate : defaultLocale;
}

function normalizeBody(value: unknown) {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\n{2,}|\r?\n/)
      : [];

  return items
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 80);
}

function slugify(value: unknown) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function createBlogId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `blog_${crypto.randomUUID()}`;
  }

  return `blog_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function mapBlogRow(row: BlogPostRow): StorefrontBlogPostRecord {
  return {
    body: normalizeBody(row.body_json),
    category: row.category,
    coverImageUrl: row.cover_image_url,
    coverNote: row.cover_note,
    createdAt: row.created_at,
    excerpt: row.excerpt,
    id: row.id,
    isPublished: row.is_published,
    locale: normalizeLocale(row.locale),
    publishedAt: row.published_at,
    readTime: row.read_time,
    slug: row.slug,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function toBlogPost(record: StorefrontBlogPostRecord): BlogPost {
  return {
    body: record.body,
    category: record.category,
    coverImageUrl: record.coverImageUrl || undefined,
    coverNote: record.coverNote,
    excerpt: record.excerpt,
    publishedAt: record.publishedAt,
    readTime: record.readTime,
    slug: record.slug,
    title: record.title,
  };
}

async function ensureBlogSchema() {
  const sql = getSql();

  if (!sql) {
    return false;
  }

  await sql`
    create table if not exists storefront_blog_posts (
      id text primary key,
      slug text not null unique,
      locale text not null default 'vi',
      title text not null,
      excerpt text not null default '',
      category text not null default '',
      cover_image_url text not null default '',
      published_at text not null default '',
      read_time text not null default '',
      cover_note text not null default '',
      body_json jsonb not null default '[]'::jsonb,
      is_published boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create index if not exists storefront_blog_posts_public_idx
    on storefront_blog_posts (is_published, locale, updated_at desc)
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists cover_image_url text not null default ''
  `;

  return true;
}

export async function listAdminBlogPosts() {
  if (!(await ensureBlogSchema())) {
    return [] satisfies StorefrontBlogPostRecord[];
  }

  const sql = getSql();

  if (!sql) {
    return [] satisfies StorefrontBlogPostRecord[];
  }

  const rows = await sql<BlogPostRow[]>`
    select
      body_json,
      category,
      cover_image_url,
      cover_note,
      created_at::text,
      excerpt,
      id,
      is_published,
      locale,
      published_at,
      read_time,
      slug,
      title,
      updated_at::text
    from storefront_blog_posts
    order by updated_at desc, created_at desc
  `;

  return rows.map(mapBlogRow);
}

export async function listPublishedBlogPosts(locale: SiteLocale) {
  if (!(await ensureBlogSchema())) {
    return [] satisfies BlogPost[];
  }

  const sql = getSql();

  if (!sql) {
    return [] satisfies BlogPost[];
  }

  const rows = await sql<BlogPostRow[]>`
    select
      body_json,
      category,
      cover_image_url,
      cover_note,
      created_at::text,
      excerpt,
      id,
      is_published,
      locale,
      published_at,
      read_time,
      slug,
      title,
      updated_at::text
    from storefront_blog_posts
    where is_published = true
      and locale = ${locale}
    order by updated_at desc, created_at desc
  `;

  return rows.map(mapBlogRow).map(toBlogPost);
}

export async function getPublishedBlogPostBySlug(
  slug: string,
  locale: SiteLocale,
) {
  if (!(await ensureBlogSchema())) {
    return undefined;
  }

  const sql = getSql();

  if (!sql) {
    return undefined;
  }

  const rows = await sql<BlogPostRow[]>`
    select
      body_json,
      category,
      cover_image_url,
      cover_note,
      created_at::text,
      excerpt,
      id,
      is_published,
      locale,
      published_at,
      read_time,
      slug,
      title,
      updated_at::text
    from storefront_blog_posts
    where is_published = true
      and slug = ${slug}
      and locale = ${locale}
    limit 1
  `;

  return rows[0] ? toBlogPost(mapBlogRow(rows[0])) : undefined;
}

export async function saveStorefrontBlogPost(
  input: StorefrontBlogPostInput,
) {
  if (!(await ensureBlogSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  const id = normalizeText(input.id) || createBlogId();
  const title = normalizeText(input.title);
  const slug = slugify(input.slug) || slugify(title);
  const body = normalizeBody(input.body);

  if (!title || !slug) {
    throw new Error("Blog title is required.");
  }

  if (body.length === 0) {
    throw new Error("Blog content is required.");
  }

  const rows = await sql<BlogPostRow[]>`
    insert into storefront_blog_posts (
      id,
      slug,
      locale,
      title,
      excerpt,
      category,
      cover_image_url,
      published_at,
      read_time,
      cover_note,
      body_json,
      is_published
    )
    values (
      ${id},
      ${slug},
      ${normalizeLocale(input.locale)},
      ${title},
      ${normalizeText(input.excerpt)},
      ${normalizeText(input.category) || "Blog"},
      ${normalizeText(input.coverImageUrl)},
      ${normalizeText(input.publishedAt)},
      ${normalizeText(input.readTime) || "3 phút đọc"},
      ${normalizeText(input.coverNote)},
      ${JSON.stringify(body)}::jsonb,
      ${input.isPublished !== false}
    )
    on conflict (id) do update
    set
      slug = excluded.slug,
      locale = excluded.locale,
      title = excluded.title,
      excerpt = excluded.excerpt,
      category = excluded.category,
      cover_image_url = excluded.cover_image_url,
      published_at = excluded.published_at,
      read_time = excluded.read_time,
      cover_note = excluded.cover_note,
      body_json = excluded.body_json,
      is_published = excluded.is_published,
      updated_at = now()
    returning
      body_json,
      category,
      cover_image_url,
      cover_note,
      created_at::text,
      excerpt,
      id,
      is_published,
      locale,
      published_at,
      read_time,
      slug,
      title,
      updated_at::text
  `;

  return mapBlogRow(rows[0]);
}

export async function deleteStorefrontBlogPost(id: string) {
  if (!(await ensureBlogSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  await sql`
    delete from storefront_blog_posts
    where id = ${id}
  `;
}
