import type { Metadata } from "next";
import { getAdminCenterCopy } from "@/lib/admin-center-copy";
import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { AdminPageClient } from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getAdminCenterCopy(locale);

  return {
    title: copy.adminPageTitle,
    description: copy.adminPageDescription,
  };
}

export default async function AdminPage() {
  const locale = await getRequestLocale();
  const copy = getAdminCenterCopy(locale);
  const orderCopy = getOrderCenterCopy(locale);

  return (
    <AdminPageClient
      copy={copy}
      locale={locale}
      orderCopy={orderCopy}
    />
  );
}
