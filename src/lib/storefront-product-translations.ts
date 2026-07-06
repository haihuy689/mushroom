import "server-only";

import { unstable_cache } from "next/cache";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import { getSql } from "@/lib/db";

export const STOREFRONT_PRODUCT_TRANSLATIONS_TAG =
  "storefront-product-translations";

type ProductTranslationRow = {
  badge: string;
  category: string;
  description: string;
  format: string;
  media_note: string;
  name: string;
  packaging: string;
  product_id: string;
  slug: string;
  tagline: string;
};

export type StorefrontProductTranslation = {
  badge: string;
  category: string;
  description: string;
  format: string;
  mediaNote: string;
  name: string;
  packaging: string;
  productId: string;
  slug: string;
  tagline: string;
};

function mapTranslationRow(row: ProductTranslationRow) {
  return {
    badge: row.badge,
    category: row.category,
    description: row.description,
    format: row.format,
    mediaNote: row.media_note,
    name: row.name,
    packaging: row.packaging,
    productId: row.product_id,
    slug: row.slug,
    tagline: row.tagline,
  } satisfies StorefrontProductTranslation;
}

const readCachedPublishedProductTranslations = unstable_cache(
  async (locale: SiteLocale) => {
    const sql = getSql();

    if (!sql || locale === "vi") {
      return [] satisfies StorefrontProductTranslation[];
    }

    try {
      const rows = await sql<ProductTranslationRow[]>`
        select
          product_id,
          slug,
          name,
          tagline,
          description,
          category,
          format,
          badge,
          packaging,
          media_note
        from storefront_product_translations
        where locale = ${locale}
          and is_published = true
      `;

      return rows.map(mapTranslationRow);
    } catch {
      return [] satisfies StorefrontProductTranslation[];
    }
  },
  [STOREFRONT_PRODUCT_TRANSLATIONS_TAG],
  {
    revalidate: 90,
    tags: [STOREFRONT_PRODUCT_TRANSLATIONS_TAG],
  },
);

export async function readPublishedProductTranslationMap(locale: SiteLocale) {
  const translations = await readCachedPublishedProductTranslations(locale);

  return new Map(
    translations.map((translation) => [translation.productId, translation]),
  );
}

export function applyProductTranslation(
  product: Product,
  translation: StorefrontProductTranslation | undefined,
) {
  if (!translation) {
    return product;
  }

  return {
    ...product,
    badge: translation.badge || product.badge,
    category: translation.category || product.category,
    description: translation.description || product.description,
    format: translation.format || product.format,
    mediaNote: translation.mediaNote || product.mediaNote,
    name: translation.name || product.name,
    packaging: translation.packaging || product.packaging,
    slug: translation.slug || product.slug,
    tagline: translation.tagline || product.tagline,
  } satisfies Product;
}
