import { NextResponse } from "next/server";
import {
  applyAdminCredentialSession,
  clearAdminCredentialSession,
  getAdminCredentialSession,
  validateAdminCredentials,
} from "@/lib/admin-credential-session";

export async function GET() {
  const session = await getAdminCredentialSession();

  return NextResponse.json({
    ok: true,
    session: session
      ? {
          username: session.username,
        }
      : null,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    password?: string;
    username?: string;
  };

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json(
      {
        error: "Invalid admin username or password.",
      },
      { status: 401 },
    );
  }

  return applyAdminCredentialSession(
    NextResponse.json({
      ok: true,
      username,
    }),
    username,
  );
}

export async function DELETE() {
  return clearAdminCredentialSession(
    NextResponse.json({
      ok: true,
    }),
  );
}

