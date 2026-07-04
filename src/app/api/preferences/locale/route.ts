import { NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  getLocaleOption,
  isSupportedLocale,
} from "@/lib/i18n";

function applyLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set({
    name: LOCALE_COOKIE_NAME,
    value: locale,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, max-age=0");

  return response;
}

function getSafeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");

  if (!isSupportedLocale(locale)) {
    return NextResponse.json(
      {
        error: "Unsupported locale.",
      },
      { status: 400 },
    );
  }

  const redirectTarget = new URL(
    getSafeReturnTo(url.searchParams.get("returnTo")),
    request.url,
  );

  return applyLocaleCookie(NextResponse.redirect(redirectTarget), locale);
}

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

  return applyLocaleCookie(
    NextResponse.json({
      ok: true,
      locale: body.locale,
      option: getLocaleOption(body.locale),
    }),
    body.locale,
  );
}
