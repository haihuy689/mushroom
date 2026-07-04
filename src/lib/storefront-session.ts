import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { PiScope, PiVerifiedUser } from "@/lib/pi-types";

export const STOREFRONT_SESSION_COOKIE_NAME = "mushroom.pi.session";

type SessionPayload = {
  uid: string;
  username?: string;
  wallet_address?: string;
  scopes: PiScope[];
  expiresAt: number;
};

function getSessionSecret() {
  if (process.env.STOREFRONT_SESSION_SECRET?.trim()) {
    return process.env.STOREFRONT_SESSION_SECRET.trim();
  }

  if (process.env.PI_API_KEY?.trim()) {
    return process.env.PI_API_KEY.trim();
  }

  if (process.env.NODE_ENV !== "production") {
    return "mushroom-pi-dev-session-secret";
  }

  throw new Error(
    "Missing STOREFRONT_SESSION_SECRET. Add a secret (or PI_API_KEY) to enable secure storefront sessions.",
  );
}

function toExpiryTimestamp(user: PiVerifiedUser) {
  const rawTimestamp = user.credentials?.valid_until?.timestamp;

  if (typeof rawTimestamp === "number" && Number.isFinite(rawTimestamp)) {
    const timestamp =
      rawTimestamp > 1_000_000_000_000 ? rawTimestamp : rawTimestamp * 1000;

    if (timestamp > Date.now()) {
      return timestamp;
    }
  }

  return Date.now() + 1000 * 60 * 60 * 24 * 7;
}

function getPayload(user: PiVerifiedUser): SessionPayload {
  return {
    uid: user.uid,
    username: user.username,
    wallet_address: user.wallet_address,
    scopes: user.credentials?.scopes ?? [],
    expiresAt: toExpiryTimestamp(user),
  };
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodePayload(user: PiVerifiedUser) {
  const encodedPayload = Buffer.from(JSON.stringify(getPayload(user))).toString(
    "base64url",
  );

  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

function parsePayload(rawValue: string) {
  const [encodedPayload, signature] = rawValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      typeof parsed.uid !== "string" ||
      !Array.isArray(parsed.scopes) ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getStorefrontSessionUser() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(STOREFRONT_SESSION_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  const payload = parsePayload(rawCookie);

  if (!payload) {
    return null;
  }

  return {
    uid: payload.uid,
    username: payload.username,
    wallet_address: payload.wallet_address,
    credentials: {
      scopes: payload.scopes,
      valid_until: {
        timestamp: payload.expiresAt,
        iso8601: new Date(payload.expiresAt).toISOString(),
      },
    },
  } satisfies PiVerifiedUser;
}

export function applyStorefrontSession(
  response: NextResponse,
  user: PiVerifiedUser,
) {
  const expiresAt = toExpiryTimestamp(user);
  const maxAge = Math.max(60, Math.floor((expiresAt - Date.now()) / 1000));

  response.cookies.set({
    name: STOREFRONT_SESSION_COOKIE_NAME,
    value: encodePayload(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, max-age=0");

  return response;
}

export function clearStorefrontSession(response: NextResponse) {
  response.cookies.set({
    name: STOREFRONT_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
