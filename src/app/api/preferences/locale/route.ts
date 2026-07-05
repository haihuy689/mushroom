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
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, max-age=0");
  response.headers.set("Vary", "Cookie, Accept-Language, X-Vercel-IP-Country");

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
  let body: { locale?: string };

  try {
    body = (await request.json()) as { locale?: string };
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON.",
      },
      { status: 400 },
    );
  }

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
