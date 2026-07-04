import type { Metadata } from "next";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { ShopCatalog } from "./shop-catalog";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);

  return {
    title: siteCopy.metadata.shopTitle,
    description: siteCopy.metadata.shopDescription,
  };
}

export default async function ShopPage() {
  const locale = await getRequestLocale();
  const copy = getStorefrontCopy(locale);
  const products = await getStorefrontProducts(locale);

  return (
    <div className={styles.page}>
      <ShopCatalog copy={copy} locale={locale} products={products} />
    </div>
  );
}
