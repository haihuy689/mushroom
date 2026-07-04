import { NextResponse } from "next/server";
import {
  clearStorefrontSession,
  getStorefrontSessionUser,
} from "@/lib/storefront-session";

export async function GET() {
  const user = await getStorefrontSessionUser();

  return NextResponse.json({
    ok: true,
    user,
  });
}

export async function DELETE() {
  return clearStorefrontSession(
    NextResponse.json({
      ok: true,
    }),
  );
}
