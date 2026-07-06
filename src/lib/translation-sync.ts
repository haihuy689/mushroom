import "server-only";

import { createHash } from "node:crypto";
import { getSql } from "@/lib/db";
import type { SiteLocale } from "@/lib/i18n";

export const TRANSLATION_SOURCE_LOCALE = "vi";
export const TRANSLATION_TARGET_LOCALES = ["en", "es", "fr", "zh"] as const;
export type TranslationTargetLocale = (typeof TRANSLATION_TARGET_LOCALES)[number];

type ProductSourceRow = {
  badge: string;
  category: string;
  description: string;
  format: string;
  id: string;
  media_note: string;
  name: string;
  packaging: string;
  tagline: string;
  updated_at: string;
};

type ProductAuditRow = ProductSourceRow & {
  translated_at: string | null;
  translation_fingerprint: string | null;
};

type BlogSourceRow = {
  body_json: unknown;
  category: string;
  cover_note: string;
  excerpt: string;
  id: string;
  published_at: string;
  read_time: string;
  slug: string;
  title: string;
  updated_at: string;
};

type BlogAuditRow = BlogSourceRow & {
  translated_at: string | null;
  translation_fingerprint: string | null;
  translation_id: string | null;
};

export type TranslationAuditStatus = "current" | "missing" | "stale";

export type TranslationAuditItem = {
  id: string;
  locale: TranslationTargetLocale;
  sourceFingerprint: string;
  sourceUpdatedAt: string;
  status: TranslationAuditStatus;
  title: string;
  translatedAt?: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isTranslationTargetLocale(
  value: string | null | undefined,
): value is TranslationTargetLocale {
  return TRANSLATION_TARGET_LOCALES.includes(value as TranslationTargetLocale);
}

function normalizeBody(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(normalizeText).filter(Boolean);
  }

  const text = normalizeText(value);

  if (!text) {
    return [];
  }

  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return parsed.map(normalizeText).filter(Boolean);
      }
    } catch {
      return [text];
    }
  }

  return text.split(/\n{2,}|\r?\n/).map(normalizeText).filter(Boolean);
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    return `{${Object.keys(objectValue)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(objectValue[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value ?? "");
}

export function createContentFingerprint(value: Record<string, unknown>) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

export function createProductSourceFingerprint(
  product: Pick<
    ProductSourceRow,
    | "badge"
    | "category"
    | "description"
    | "format"
    | "media_note"
    | "name"
    | "packaging"
    | "tagline"
  >,
) {
  return createContentFingerprint({
    badge: normalizeText(product.badge),
    category: normalizeText(product.category),
    description: normalizeText(product.description),
    format: normalizeText(product.format),
    mediaNote: normalizeText(product.media_note),
    name: normalizeText(product.name),
    packaging: normalizeText(product.packaging),
    tagline: normalizeText(product.tagline),
  });
}

export function createBlogSourceFingerprint(
  post: Pick<
    BlogSourceRow,
    | "body_json"
    | "category"
    | "cover_note"
    | "excerpt"
    | "published_at"
    | "read_time"
    | "title"
  >,
) {
  return createContentFingerprint({
    body: normalizeBody(post.body_json),
    category: normalizeText(post.category),
    coverNote: normalizeText(post.cover_note),
    excerpt: normalizeText(post.excerpt),
    publishedAt: normalizeText(post.published_at),
    readTime: normalizeText(post.read_time),
    title: normalizeText(post.title),
  });
}

export async function ensureTranslationTrackingSchema() {
  const sql = getSql();

  if (!sql) {
    return false;
  }

  await sql`
    create table if not exists storefront_product_translations (
      product_id text not null references storefront_products(id) on delete cascade,
      locale text not null,
      slug text not null default '',
      name text not null default '',
      tagline text not null default '',
      description text not null default '',
      category text not null default '',
      format text not null default '',
      badge text not null default '',
      packaging text not null default '',
      media_note text not null default '',
      is_published boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      primary key (product_id, locale)
    )
  `;

  await sql`
    alter table storefront_product_translations
    add column if not exists source_locale text not null default ${TRANSLATION_SOURCE_LOCALE}
  `;
  await sql`
    alter table storefront_product_translations
    add column if not exists source_updated_at timestamptz
  `;
  await sql`
    alter table storefront_product_translations
    add column if not exists source_fingerprint text not null default ''
  `;
  await sql`
    alter table storefront_product_translations
    add column if not exists translated_at timestamptz
  `;
  await sql`
    alter table storefront_product_translations
    add column if not exists translation_status text not null default 'published'
  `;
  await sql`
    create index if not exists storefront_product_translations_sync_idx
    on storefront_product_translations (locale, source_locale, source_fingerprint)
  `;

  await sql`
    alter table storefront_blog_posts
    add column if not exists source_locale text
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists source_post_id text
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists source_updated_at timestamptz
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists source_fingerprint text not null default ''
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists translated_at timestamptz
  `;
  await sql`
    alter table storefront_blog_posts
    add column if not exists translation_status text not null default 'source'
  `;
  await sql`
    create index if not exists storefront_blog_posts_translation_sync_idx
    on storefront_blog_posts (locale, source_locale, source_post_id)
  `;

  return true;
}

function getAuditStatus(
  sourceFingerprint: string,
  translationFingerprint?: string | null,
): TranslationAuditStatus {
  if (!translationFingerprint) {
    return "missing";
  }

  return translationFingerprint === sourceFingerprint ? "current" : "stale";
}

export async function readTranslationAuditForLocale(
  targetLocale: TranslationTargetLocale,
) {
  const sql = getSql();

  if (!sql || !(await ensureTranslationTrackingSchema())) {
    return {
      blogPosts: [] as TranslationAuditItem[],
      products: [] as TranslationAuditItem[],
    };
  }

  const [productRows, blogRows] = await Promise.all([
    sql<ProductAuditRow[]>`
      select
        product.id,
        product.name,
        product.tagline,
        product.description,
        product.category,
        product.format,
        product.badge,
        product.packaging,
        product.media_note,
        product.updated_at::text,
        translation.source_fingerprint as translation_fingerprint,
        translation.translated_at::text
      from storefront_products product
      left join storefront_product_translations translation
        on translation.product_id = product.id
        and translation.locale = ${targetLocale}
      where product.source_product_id is null
      order by product.updated_at desc, product.name asc
    `,
    sql<BlogAuditRow[]>`
      select
        source.id,
        source.slug,
        source.title,
        source.excerpt,
        source.category,
        source.cover_note,
        source.published_at,
        source.read_time,
        source.body_json,
        source.updated_at::text,
        translation.id as translation_id,
        translation.source_fingerprint as translation_fingerprint,
        translation.translated_at::text
      from storefront_blog_posts source
      left join storefront_blog_posts translation
        on translation.source_post_id = source.id
        and translation.locale = ${targetLocale}
      where source.locale = ${TRANSLATION_SOURCE_LOCALE}
      order by source.updated_at desc, source.title asc
    `,
  ]);

  const products = productRows.map((row) => {
    const sourceFingerprint = createProductSourceFingerprint(row);

    return {
      id: row.id,
      locale: targetLocale,
      sourceFingerprint,
      sourceUpdatedAt: row.updated_at,
      status: getAuditStatus(sourceFingerprint, row.translation_fingerprint),
      title: row.name,
      translatedAt: row.translated_at ?? undefined,
    } satisfies TranslationAuditItem;
  });

  const blogPosts = blogRows.map((row) => {
    const sourceFingerprint = createBlogSourceFingerprint(row);

    return {
      id: row.id,
      locale: targetLocale,
      sourceFingerprint,
      sourceUpdatedAt: row.updated_at,
      status: getAuditStatus(sourceFingerprint, row.translation_fingerprint),
      title: row.title,
      translatedAt: row.translated_at ?? undefined,
    } satisfies TranslationAuditItem;
  });

  return { blogPosts, products };
}

export async function readAllTranslationAudits() {
  const entries = await Promise.all(
    TRANSLATION_TARGET_LOCALES.map(async (locale) => [
      locale,
      await readTranslationAuditForLocale(locale),
    ] as const),
  );

  return Object.fromEntries(entries) as Record<
    TranslationTargetLocale,
    Awaited<ReturnType<typeof readTranslationAuditForLocale>>
  >;
}

export async function readEnglishTranslationAudit() {
  return readTranslationAuditForLocale("en");
}

export function isPublicTranslationLocale(locale: SiteLocale) {
  return locale !== TRANSLATION_SOURCE_LOCALE;
}
