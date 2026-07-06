import "server-only";

import type { BlogPost } from "@/lib/pi-types";
import type { SiteLocale } from "@/lib/i18n";
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
} from "@/lib/storefront-blog";
import {
  getBlogPostBySlug as getStaticBlogPostBySlug,
  getBlogPosts as getStaticBlogPosts,
} from "@/lib/site-data";

export async function getPublicBlogPosts(locale: SiteLocale) {
  const dynamicPosts = await listPublishedBlogPosts(locale);
  const dynamicSlugs = new Set(dynamicPosts.map((post) => post.slug));
  const staticPosts = getStaticBlogPosts(locale).filter(
    (post) => !dynamicSlugs.has(post.slug),
  );

  return [...dynamicPosts, ...staticPosts];
}

export async function getPublicBlogPostBySlug(
  slug: string,
  locale: SiteLocale,
): Promise<BlogPost | undefined> {
  return (
    (await getPublishedBlogPostBySlug(slug, locale)) ??
    getStaticBlogPostBySlug(slug, locale)
  );
}
