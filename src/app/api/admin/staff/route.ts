import { NextResponse } from "next/server";
import {
  addStorefrontStaffMember,
  listStorefrontStaffMembers,
  removeStorefrontStaffMember,
} from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Only the owner can manage staff.",
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

  const body = (await request.json()) as { username?: string };

  if (!body.username?.trim()) {
    return NextResponse.json(
      {
        error: "Staff username is required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    items: await addStorefrontStaffMember(user, body.username),
  });
}

export async function DELETE(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageStaff) {
    return forbiddenResponse();
  }

  const body = (await request.json()) as { username?: string };

  if (!body.username?.trim()) {
    return NextResponse.json(
      {
        error: "Staff username is required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    items: await removeStorefrontStaffMember(body.username),
  });
}
