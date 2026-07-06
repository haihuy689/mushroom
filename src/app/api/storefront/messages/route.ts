import { NextResponse } from "next/server";
import {
  createStorefrontUserMessage,
  listStorefrontMessagesForUser,
} from "@/lib/storefront-db";
import { getStorefrontSessionUser } from "@/lib/storefront-session";

export const preferredRegion = "sin1";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Pi sign-in is required for messages.",
    },
    { status: 401 },
  );
}

export async function GET() {
  const user = await getStorefrontSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  const response = await listStorefrontMessagesForUser(user);

  if (!response.databaseConfigured) {
    return NextResponse.json(
      {
        error: "Database is not configured.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    items: response.items,
  });
}

export async function POST(request: Request) {
  const user = await getStorefrontSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as {
      body?: unknown;
      orderId?: unknown;
    };
    const message = await createStorefrontUserMessage(user, body);

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
