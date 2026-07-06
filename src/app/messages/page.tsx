import type { Metadata } from "next";
import { getMessageCenterCopy } from "@/lib/message-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { MessagesPageClient } from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getMessageCenterCopy(locale);

  return {
    title: copy.messagePageTitle,
    description: copy.messagePageDescription,
  };
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ orderId?: string }>;
}) {
  const locale = await getRequestLocale();
  const copy = getMessageCenterCopy(locale);
  const params = searchParams ? await searchParams : {};

  return (
    <MessagesPageClient
      copy={copy}
      initialOrderId={params.orderId ?? ""}
      locale={locale}
    />
  );
}
