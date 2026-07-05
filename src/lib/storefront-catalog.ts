import "server-only";

import { unstable_cache } from "next/cache";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import { readStorefrontProductRecordsDirect } from "@/lib/storefront-db";
import {
  mapProductRecordToProduct,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";

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
      typeof product.inventoryCount === "number" ? product.inventoryCount : 0,
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

export async function getStorefrontProducts(_locale: SiteLocale) {
  void _locale;

  const dbProducts = await readStorefrontProductRecordsForCatalog();

  return dbProducts
    .filter(
      (productRecord) =>
        productRecord.isActive && !productRecord.sourceProductId,
    )
    .map((productRecord) =>
      withOperationalDefaults(mapProductRecordToProduct(productRecord)),
    );
}
