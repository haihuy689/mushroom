import "server-only";

import type { BlogPost } from "@/lib/pi-types";
import type { SiteLocale } from "@/lib/i18n";
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
} from "@/lib/storefront-blog";

export async function getPublicBlogPosts(locale: SiteLocale) {
  return listPublishedBlogPosts(locale);
}

export async function getPublicBlogPostBySlug(
  slug: string,
  locale: SiteLocale,
): Promise<BlogPost | undefined> {
  return getPublishedBlogPostBySlug(slug, locale);
}
