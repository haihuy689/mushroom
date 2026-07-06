import { NextResponse } from "next/server";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import { readEnglishTranslationAudit } from "@/lib/translation-sync";

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

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  const audit = await readEnglishTranslationAudit();

  return NextResponse.json({
    blogPosts: audit.blogPosts,
    products: audit.products,
    summary: {
      blogPosts: countByStatus(audit.blogPosts),
      products: countByStatus(audit.products),
    },
  });
}
