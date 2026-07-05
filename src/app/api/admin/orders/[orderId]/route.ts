import { NextResponse } from "next/server";
import { isOrderStatus } from "@/lib/order-status";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import { updateStorefrontOrderRecord } from "@/lib/storefront-db";

export const preferredRegion = "sin1";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { access, user } = await getStorefrontAdminContext();

  if (!access.canManageOrders || (!user?.username && !user?.uid)) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    adminNote?: string;
    deliveredAt?: string;
    fulfillmentStaff?: string;
    receivedBy?: string;
    shippingCarrier?: string;
    shipperName?: string;
    status?: string;
    trackingCode?: string;
  };

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
    const order = await updateStorefrontOrderRecord(
      orderId,
      {
        adminNote: body.adminNote,
        deliveredAt: body.deliveredAt,
        fulfillmentStaff: body.fulfillmentStaff,
        receivedBy: body.receivedBy,
        shippingCarrier: body.shippingCarrier,
        shipperName: body.shipperName,
        status: body.status,
        trackingCode: body.trackingCode,
      },
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
