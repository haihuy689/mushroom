import { NextResponse } from "next/server";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import {
  isTranslationTargetLocale,
  readAllTranslationAudits,
  readTranslationAuditForLocale,
} from "@/lib/translation-sync";

export const preferredRegion = "sin1";

function countByStatus<T extends { status: string }>(items: T[]) {
  return items.reduce(
    (counts, item) => ({
      ...counts,
      [item.status]: (counts[item.status] ?? 0) + 1,
    }),
    {} as Record<string, number>,
  );
}

function createAuditResponse<T extends { blogPosts: unknown[]; products: unknown[] }>(
  audit: T,
) {
  return {
    ...audit,
    summary: {
      blogPosts: countByStatus(audit.blogPosts as Array<{ status: string }>),
      products: countByStatus(audit.products as Array<{ status: string }>),
    },
  };
}

export async function GET(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  const locale = new URL(request.url).searchParams.get("locale");

  if (isTranslationTargetLocale(locale)) {
    return NextResponse.json(
      createAuditResponse(await readTranslationAuditForLocale(locale)),
    );
  }

  const audits = await readAllTranslationAudits();

  return NextResponse.json({
    locales: Object.fromEntries(
      Object.entries(audits).map(([localeKey, audit]) => [
        localeKey,
        createAuditResponse(audit),
      ]),
    ),
  });
}
