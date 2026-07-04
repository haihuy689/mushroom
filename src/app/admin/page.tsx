import type { Metadata } from "next";
import { getAdminCenterCopy } from "@/lib/admin-center-copy";
import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import {
  listStorefrontOrdersForAdmin,
  listStorefrontProductRecords,
  listStorefrontStaffMembers,
} from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
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
  const adminContext = await getStorefrontAdminContext();
  const [initialOrders, initialStaff, initialProducts] = adminContext.access.canAccessAdmin
    ? await Promise.all([
        listStorefrontOrdersForAdmin(),
        adminContext.access.canManageStaff
          ? listStorefrontStaffMembers()
          : Promise.resolve([]),
        adminContext.access.canManageStaff
          ? listStorefrontProductRecords()
          : Promise.resolve([]),
      ])
    : [[], [], []];

  return (
    <AdminPageClient
      copy={copy}
      initialAccess={adminContext.access}
      initialCredentialSessionActive={adminContext.authMode === "credentials"}
      initialOrders={initialOrders}
      initialProducts={initialProducts}
      initialStaff={initialStaff}
      key={`${adminContext.authMode}:${adminContext.access.role}:${adminContext.access.username ?? "guest"}`}
      locale={locale}
      orderCopy={orderCopy}
    />
  );
}
