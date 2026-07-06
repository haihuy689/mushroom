import { NextResponse } from "next/server";
import {
  createStorefrontAdminMessage,
  listStorefrontMessagesForAdmin,
} from "@/lib/storefront-db";
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
      items: await listStorefrontMessagesForAdmin(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load messages right now.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const { access, user } = await getStorefrontAdminContext();

  if (!access.canManageOrders || (!user?.username && !user?.uid)) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as {
      body?: unknown;
      orderId?: unknown;
      piUid?: unknown;
    };
    const message = await createStorefrontAdminMessage({
      actorUsername: user.username ?? user.uid,
      body: body.body,
      orderId: body.orderId,
      piUid: body.piUid,
    });

    return NextResponse.json({
      item: message,
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to send message.",
      },
      { status: 400 },
    );
  }
}
