import { NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  getLocaleOption,
  isSupportedLocale,
} from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };

  if (!isSupportedLocale(body.locale)) {
    return NextResponse.json(
      {
        error: "Unsupported locale.",
      },
      { status: 400 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    locale: body.locale,
    option: getLocaleOption(body.locale),
  });

  response.cookies.set({
    name: LOCALE_COOKIE_NAME,
    value: body.locale,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
