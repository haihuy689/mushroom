import "server-only";

import { unstable_cache } from "next/cache";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import { readStorefrontProductRecordsDirect } from "@/lib/storefront-db";
import {
  mapProductRecordToProduct,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import { getProducts } from "@/lib/site-data";

const PRODUCT_RECORDS_REVALIDATE_SECONDS = 90;
export const STOREFRONT_PRODUCT_RECORDS_TAG = "storefront-product-records";

declare global {
  var __mushroomLastCatalogProductRecords: StorefrontProductRecord[] | undefined;
}

const readCachedStorefrontProductRecords = unstable_cache(
  async () => {
    const records = await readStorefrontProductRecordsDirect();

    if (records === null) {
      throw new Error("Storefront product records are unavailable.");
    }

    globalThis.__mushroomLastCatalogProductRecords = records;
    return records;
  },
  [STOREFRONT_PRODUCT_RECORDS_TAG],
  {
    revalidate: PRODUCT_RECORDS_REVALIDATE_SECONDS,
    tags: [STOREFRONT_PRODUCT_RECORDS_TAG],
  },
);

function withOperationalDefaults(product: Product): Product {
  return {
    ...product,
    actualSoldCount:
      typeof product.actualSoldCount === "number" ? product.actualSoldCount : 0,
    baseSoldCount:
      typeof product.baseSoldCount === "number" ? product.baseSoldCount : 0,
    galleryImageUrls: Array.isArray(product.galleryImageUrls)
      ? product.galleryImageUrls
      : [],
    inventoryCount:
      typeof product.inventoryCount === "number" ? product.inventoryCount : 24,
    isActive: product.isActive !== false,
    isFeatured: product.isFeatured === true,
    lowStockThreshold:
      typeof product.lowStockThreshold === "number"
        ? product.lowStockThreshold
        : 5,
    mediaNote: product.mediaNote ?? undefined,
    packaging: product.packaging ?? "",
    sku: product.sku ?? "",
    videoUrl: product.videoUrl ?? undefined,
    weightUnit: product.weightUnit ?? undefined,
    weightValue: product.weightValue ?? undefined,
  };
}

async function readStorefrontProductRecordsForCatalog() {
  try {
    return await readCachedStorefrontProductRecords();
  } catch {
    return globalThis.__mushroomLastCatalogProductRecords ?? [];
  }
}

const viPackagingTranslations = new Map([
  ["12 stick pack", "12 gói thanh"],
  ["12 stick packs", "12 gói thanh"],
  ["12 sticks", "12 gói thanh"],
  ["30 sachet", "30 gói"],
  ["30 sachets", "30 gói"],
  ["50 ml tincture", "Lọ chiết xuất 50 ml"],
  ["recipe box", "Hộp công thức món ăn"],
  ["tincture 50 ml", "Lọ chiết xuất 50 ml"],
]);

function normalizePackagingKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function localizeStaticPackaging(
  product: Product,
  staticProduct: Product,
  locale: SiteLocale,
) {
  const packaging = product.packaging || product.format || staticProduct.format;

  if (locale !== "vi") {
    return packaging;
  }

  const normalizedPackaging = normalizePackagingKey(packaging);

  if (!normalizedPackaging || normalizedPackaging === "standard pack") {
    return staticProduct.format;
  }

  return viPackagingTranslations.get(normalizedPackaging) ?? packaging;
}

function withLocalizedStaticCopy(
  product: Product,
  staticProduct: Product,
  locale: SiteLocale,
) {
  if (locale === "en") {
    return product;
  }

  return {
    ...product,
    badge: staticProduct.badge,
    category: staticProduct.category,
    description: staticProduct.description,
    format: staticProduct.format,
    name: staticProduct.name,
    packaging: localizeStaticPackaging(product, staticProduct, locale),
    tagline: staticProduct.tagline,
  };
}

export async function getStorefrontProducts(locale: SiteLocale) {
  const staticProducts = getProducts(locale).map(withOperationalDefaults);
  const staticById = new Map(staticProducts.map((product) => [product.id, product]));
  const dbProducts = await readStorefrontProductRecordsForCatalog();

  if (dbProducts.length === 0) {
    return staticProducts;
  }

  const customProducts = dbProducts.filter(
    (productRecord) => !productRecord.sourceProductId,
  );
  const publicProductRecords =
    customProducts.length > 0 ? customProducts : dbProducts;
  const catalogProducts: Product[] = [];

  for (const productRecord of publicProductRecords) {
    if (!productRecord.isActive) {
      continue;
    }

    const staticProductId = productRecord.sourceProductId ?? productRecord.id;
    const staticProduct = staticById.get(staticProductId);
    const product = withOperationalDefaults(mapProductRecordToProduct(productRecord));

    if (staticProduct) {
      catalogProducts.push(
        withLocalizedStaticCopy(
          {
            ...product,
            imageUrl: product.imageUrl || staticProduct.imageUrl,
            sourceProductId: product.sourceProductId ?? staticProduct.id,
            sku: product.sku || staticProduct.sku,
          },
          staticProduct,
          locale,
        ),
      );
      continue;
    }

    catalogProducts.push(product);
  }

  return catalogProducts;
}
