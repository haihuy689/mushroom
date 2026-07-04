import { NextResponse } from "next/server";
import { PiApiError, verifyPiUser } from "@/lib/pi-server";
import type { PiAuthUser, PiVerifiedUser } from "@/lib/pi-types";
import { applyStorefrontSession } from "@/lib/storefront-session";

function mergePiIdentity(
  verifiedUser: PiVerifiedUser,
  fallbackUser?: PiAuthUser,
): PiVerifiedUser {
  if (!fallbackUser?.uid || fallbackUser.uid !== verifiedUser.uid) {
    return verifiedUser;
  }

  return {
    ...verifiedUser,
    username: fallbackUser.username ?? verifiedUser.username,
    wallet_address: fallbackUser.wallet_address ?? verifiedUser.wallet_address,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      accessToken?: string;
      user?: PiAuthUser;
    };

    if (!body.accessToken) {
      return NextResponse.json(
        {
          error: "Missing accessToken.",
        },
        { status: 400 },
      );
    }

    const verifiedUser = await verifyPiUser(body.accessToken);
    const user = mergePiIdentity(verifiedUser, body.user);

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
