import { NextResponse } from "next/server";
import {
  applyAdminCredentialSession,
  validateAdminCredentials,
} from "@/lib/admin-credential-session";
import { saveStoredAdminPassword } from "@/lib/admin-password-store";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

export async function PATCH(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin || !access.username) {
    return NextResponse.json(
      {
        error: "Admin session is required to change the password.",
      },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    confirmPassword?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (newPassword.length < 8) {
    return NextResponse.json(
      {
        error: "New password must be at least 8 characters.",
      },
      { status: 400 },
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      {
        error: "New password confirmation does not match.",
      },
      { status: 400 },
    );
  }

  if (!(await validateAdminCredentials(access.username, currentPassword))) {
    return NextResponse.json(
      {
        error: "Current admin password is not correct.",
      },
      { status: 401 },
    );
  }

  await saveStoredAdminPassword(access.username, newPassword);

  return applyAdminCredentialSession(
    NextResponse.json({
      ok: true,
      username: access.username,
    }),
    access.username,
  );
}
