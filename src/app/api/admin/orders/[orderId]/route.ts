import { NextResponse } from "next/server";
import { isOrderStatus } from "@/lib/order-status";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import { updateStorefrontOrderStatus } from "@/lib/storefront-db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { access, user } = await getStorefrontAdminContext();

  if (!access.canManageOrders || (!user?.username && !user?.uid)) {
    return NextResponse.json(
      {
        error: "Admin access is required.",
      },
      { status: 403 },
    );
  }

  const body = (await request.json()) as { status?: string };

  if (!isOrderStatus(body.status)) {
    return NextResponse.json(
      {
        error: "Invalid order status.",
      },
      { status: 400 },
    );
  }

  const { orderId } = await context.params;

  try {
    const order = await updateStorefrontOrderStatus(
      orderId,
      body.status,
      user.username ?? user.uid,
    );

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update order status.",
      },
      { status: 400 },
    );
  }
}
