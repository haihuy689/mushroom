import { NextResponse } from "next/server";
import { guestAdminAccess } from "@/lib/admin-access";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export async function GET() {
  try {
    const { access, user } = await getStorefrontAdminContext();

    return NextResponse.json({
      ...access,
      username: access.username ?? user?.username ?? user?.uid ?? null,
    });
  } catch {
    return NextResponse.json(guestAdminAccess());
  }
}
