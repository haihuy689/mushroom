import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { getSiteCopy } from "@/lib/site-data";
import { CartPageClient } from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getStorefrontCopy(locale);

  return {
    title: copy.cartPageTitle,
    description: copy.cartPageDescription,
  };
}

export default async function CartPage() {
  const locale = await getRequestLocale();
  const products = await getStorefrontProducts(locale);
  const siteCopy = getSiteCopy(locale);
  const copy = getStorefrontCopy(locale);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <CartPageClient
      products={products}
      copy={copy}
      piCopy={siteCopy.piPanel}
      serverConfigured={serverConfigured}
    />
  );
}
