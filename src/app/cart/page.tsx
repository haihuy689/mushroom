import type { Metadata } from "next";
import { getProducts, getSiteCopy } from "@/lib/site-data";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontCopy } from "@/lib/storefront-copy";
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
  const products = getProducts(locale);
  const siteCopy = getSiteCopy(locale);
  const copy = getStorefrontCopy(locale);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <CartPageClient
      locale={locale}
      products={products}
      copy={copy}
      piCopy={siteCopy.piPanel}
      serverConfigured={serverConfigured}
    />
  );
}
