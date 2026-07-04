import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { AccountPageClient } from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getStorefrontCopy(locale);

  return {
    title: copy.accountPageTitle,
    description: copy.accountPageDescription,
  };
}

export default async function AccountPage() {
  const locale = await getRequestLocale();
  const copy = getStorefrontCopy(locale);

  return <AccountPageClient locale={locale} copy={copy} />;
}
