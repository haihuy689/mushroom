import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE_NAME = "mushroom.admin.session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_ADMIN_USERNAME = "admin";

type AdminSessionPayload = {
  expiresAt: number;
  username: string;
};

function getSessionSecret() {
  if (process.env.STOREFRONT_SESSION_SECRET?.trim()) {
    return process.env.STOREFRONT_SESSION_SECRET.trim();
  }

  if (process.env.PI_API_KEY?.trim()) {
    return process.env.PI_API_KEY.trim();
  }

  const configuredAdminUsername =
    process.env.ADMIN_PORTAL_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
  const configuredAdminPassword = process.env.ADMIN_PORTAL_PASSWORD?.trim();

  if (configuredAdminPassword) {
    return `mushroom-admin-session:${configuredAdminUsername}:${configuredAdminPassword}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "mushroom-pi-dev-session-secret";
  }

  return "mushroom-admin-session:fallback";
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodePayload(payload: AdminSessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

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
    ) as AdminSessionPayload;

    if (
      typeof parsed.username !== "string" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getConfiguredAdminUsername() {
  return process.env.ADMIN_PORTAL_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
}

function getConfiguredAdminPassword() {
  return process.env.ADMIN_PORTAL_PASSWORD?.trim() || "";
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    username.trim() === getConfiguredAdminUsername() &&
    password === getConfiguredAdminPassword()
  );
}

export async function getAdminCredentialSession() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  return parsePayload(rawCookie);
}

export function applyAdminCredentialSession(
  response: NextResponse,
  username: string,
) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: encodePayload({
      expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
      username: username.trim(),
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, max-age=0");

  return response;
}

export function clearAdminCredentialSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
