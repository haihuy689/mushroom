import { NextResponse } from "next/server";
import { PiApiError, verifyPiUser } from "@/lib/pi-server";
import { applyStorefrontSession } from "@/lib/storefront-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { accessToken?: string };

    if (!body.accessToken) {
      return NextResponse.json(
        {
          error: "Missing accessToken.",
        },
        { status: 400 },
      );
    }

    const user = await verifyPiUser(body.accessToken);

    return applyStorefrontSession(
      NextResponse.json({
        ok: true,
        user,
      }),
      user,
    );
  } catch (error) {
    if (error instanceof PiApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: "Unexpected Pi authentication error.",
      },
      { status: 500 },
    );
  }
}
