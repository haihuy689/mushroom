import type { SiteLocale } from "@/lib/i18n";

export type StorefrontBlogPostRecord = {
  body: string[];
  category: string;
  coverNote: string;
  createdAt: string;
  excerpt: string;
  id: string;
  isPublished: boolean;
  locale: SiteLocale;
  publishedAt: string;
  readTime: string;
  slug: string;
  title: string;
  updatedAt: string;
};

export type StorefrontBlogPostInput = Partial<
  Omit<StorefrontBlogPostRecord, "createdAt" | "updatedAt">
>;
