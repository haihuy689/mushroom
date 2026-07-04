import type { Metadata } from "next";
import { getAdminCenterCopy } from "@/lib/admin-center-copy";
import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { ensureStorefrontSchema } from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import { AdminPageClient } from "./page-client";

export const preferredRegion = "sin1";

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
  const adminContext = await getStorefrontAdminContext();

  if (adminContext.access.canAccessAdmin) {
    await ensureStorefrontSchema();
  }

  return (
    <AdminPageClient
      copy={copy}
      initialAccess={adminContext.access}
      initialCredentialSessionActive={adminContext.user !== null}
      initialOrders={null}
      initialProducts={null}
      initialStaff={null}
      key={`${adminContext.authMode}:${adminContext.access.role}:${adminContext.access.username ?? "guest"}`}
      locale={locale}
      orderCopy={orderCopy}
    />
  );
}
