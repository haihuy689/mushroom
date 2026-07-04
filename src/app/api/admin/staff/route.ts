import { NextResponse } from "next/server";
import {
  listStorefrontStaffMembers,
  removeStorefrontStaffMember,
  saveStorefrontStaffMember,
} from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Admin session is required.",
    },
    { status: 403 },
  );
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return forbiddenResponse();
  }

  return NextResponse.json({
    items: access.canManageStaff ? await listStorefrontStaffMembers() : [],
  });
}

export async function POST(request: Request) {
  const { access, user } = await getStorefrontAdminContext();

  if (!access.canManageStaff || !user) {
    return forbiddenResponse();
  }

  const body = (await request.json()) as {
    canManageOrders?: boolean;
    canManageProducts?: boolean;
    canManageStaff?: boolean;
    fullName?: string;
    identity?: string;
    isActive?: boolean;
    note?: string;
    role?: string;
    username?: string;
  };
  const identity = body.identity?.trim() || body.username?.trim();

  if (!identity) {
    return NextResponse.json(
      {
        error: "Employee login or code is required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    items: await saveStorefrontStaffMember(user, {
      canManageOrders: body.canManageOrders,
      canManageProducts: body.canManageProducts,
      canManageStaff: body.canManageStaff,
      fullName: body.fullName,
      identity,
      isActive: body.isActive,
      note: body.note,
      role: body.role,
    }),
  });
}

export async function DELETE(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageStaff) {
    return forbiddenResponse();
  }

  const body = (await request.json()) as { identity?: string; username?: string };
  const identity = body.identity?.trim() || body.username?.trim();

  if (!identity) {
    return NextResponse.json(
      {
        error: "Employee login or code is required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    items: await removeStorefrontStaffMember(identity),
  });
}
