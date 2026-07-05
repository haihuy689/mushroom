import type { Metadata } from "next";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { OrdersPageClient } from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getOrderCenterCopy(locale);

  return {
    title: copy.ordersPageTitle,
    description: copy.ordersPageDescription,
  };
}

export default async function OrdersPage() {
  const locale = await getRequestLocale();
  const copy = getOrderCenterCopy(locale);
  const siteCopy = getPublicSiteCopy(locale);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <OrdersPageClient
      locale={locale}
      copy={copy}
      piCopy={siteCopy.piCheckout}
      serverConfigured={serverConfigured}
    />
  );
}
