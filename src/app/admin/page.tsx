import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminCenterCopy } from "@/lib/admin-center-copy";
import type { StorefrontStaffMember } from "@/lib/admin-access";
import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import {
  listStorefrontOrdersForAdmin,
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
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    notFound();
  }

  const [orders, staff] = await Promise.all([
    listStorefrontOrdersForAdmin(),
    access.canManageStaff
      ? listStorefrontStaffMembers()
      : Promise.resolve([] as StorefrontStaffMember[]),
  ]);

  return (
    <AdminPageClient
      access={access}
      copy={copy}
      locale={locale}
      orderCopy={orderCopy}
      orders={orders}
      staff={staff}
    />
  );
}
