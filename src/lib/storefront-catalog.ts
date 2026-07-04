import "server-only";

import { unstable_cache } from "next/cache";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import { listStorefrontProductRecords } from "@/lib/storefront-db";
import {
  mapProductRecordToProduct,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import { getProducts } from "@/lib/site-data";

const PRODUCT_RECORDS_REVALIDATE_SECONDS = 90;
const PRODUCT_RECORDS_TIMEOUT_MS = 1200;
export const STOREFRONT_PRODUCT_RECORDS_TAG = "storefront-product-records";

const readCachedStorefrontProductRecords = unstable_cache(
  async () => {
    try {
      return await listStorefrontProductRecords();
    } catch {
      return [] as StorefrontProductRecord[];
    }
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
    inventoryCount:
      typeof product.inventoryCount === "number" ? product.inventoryCount : 24,
    isActive: product.isActive !== false,
    isFeatured: product.isFeatured === true,
    lowStockThreshold:
      typeof product.lowStockThreshold === "number"
        ? product.lowStockThreshold
        : 5,
    packaging: product.packaging ?? "",
    sku: product.sku ?? "",
    weightUnit: product.weightUnit ?? undefined,
    weightValue: product.weightValue ?? undefined,
  };
}

async function readStorefrontProductRecordsForCatalog() {
  return await Promise.race<StorefrontProductRecord[]>([
    readCachedStorefrontProductRecords(),
    new Promise<StorefrontProductRecord[]>((resolve) => {
      setTimeout(() => resolve([]), PRODUCT_RECORDS_TIMEOUT_MS);
    }),
  ]);
}

export async function getStorefrontProducts(locale: SiteLocale) {
  const staticProducts = getProducts(locale).map(withOperationalDefaults);
  const staticById = new Map(staticProducts.map((product) => [product.id, product]));
  const dbProducts = await readStorefrontProductRecordsForCatalog();

  if (dbProducts.length === 0) {
    return staticProducts;
  }

  const mergedProducts = new Map<string, Product>(
    staticProducts.map((product) => [product.id, product]),
  );

  for (const productRecord of dbProducts) {
    const staticProductId = productRecord.sourceProductId ?? productRecord.id;
    const staticProduct = staticById.get(staticProductId);

    if (staticProduct) {
      if (!productRecord.isActive) {
        mergedProducts.delete(staticProduct.id);
        continue;
      }

      mergedProducts.set(staticProduct.id, {
        ...staticProduct,
        accent: productRecord.accent || staticProduct.accent,
        badge: productRecord.badge || staticProduct.badge,
        compareAtPi: productRecord.compareAtPi ?? staticProduct.compareAtPi,
        costPi: productRecord.costPi ?? staticProduct.costPi,
        imageUrl: productRecord.imageUrl || staticProduct.imageUrl,
        inventoryCount: productRecord.inventoryCount,
        isActive: productRecord.isActive,
        isFeatured: productRecord.isFeatured,
        lowStockThreshold: productRecord.lowStockThreshold,
        packaging: productRecord.packaging || undefined,
        pricePi: productRecord.pricePi,
        sourceProductId: productRecord.sourceProductId ?? staticProduct.id,
        sku: productRecord.sku || staticProduct.sku,
        weightUnit: productRecord.weightUnit ?? undefined,
        weightValue: productRecord.weightValue ?? undefined,
      });
      continue;
    }

    if (!productRecord.isActive) {
      mergedProducts.delete(productRecord.id);
      continue;
    }

    mergedProducts.set(productRecord.id, mapProductRecordToProduct(productRecord));
  }

  return Array.from(mergedProducts.values()).filter((product) => product.isActive !== false);
}
