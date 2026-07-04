import { NextResponse } from "next/server";
import { listStorefrontOrdersForAdmin } from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageOrders) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    items: await listStorefrontOrdersForAdmin(),
  });
}
