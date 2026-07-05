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

  try {
    return NextResponse.json({
      items: await listStorefrontOrdersForAdmin(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load admin orders right now.",
      },
      { status: 503 },
    );
  }
}
