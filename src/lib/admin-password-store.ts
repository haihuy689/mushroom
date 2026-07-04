import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";

const ADMIN_PASSWORD_HASH_PREFIX = "scrypt";
const ADMIN_PASSWORD_KEY_LENGTH = 64;

type AdminPasswordRow = {
  password_hash: string;
};

function normalizeAdminUsername(username: string) {
  return username.trim().toLowerCase();
}

function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const key = scryptSync(password, salt, ADMIN_PASSWORD_KEY_LENGTH).toString(
    "base64url",
  );

  return `${ADMIN_PASSWORD_HASH_PREFIX}:${salt}:${key}`;
}

function verifyPasswordHash(password: string, encodedHash: string) {
  const [prefix, salt, storedKey] = encodedHash.split(":");

  if (prefix !== ADMIN_PASSWORD_HASH_PREFIX || !salt || !storedKey) {
    return false;
  }

  const storedKeyBuffer = Buffer.from(storedKey, "base64url");
  const candidateKeyBuffer = scryptSync(
    password,
    salt,
    storedKeyBuffer.length,
  );

  return (
    candidateKeyBuffer.length === storedKeyBuffer.length &&
    timingSafeEqual(candidateKeyBuffer, storedKeyBuffer)
  );
}

async function ensureAdminPasswordTable() {
  const sql = getSql();

  if (!sql) {
    return false;
  }

  await sql`
    create table if not exists storefront_admin_credentials (
      username_key text primary key,
      display_username text not null,
      password_hash text not null,
      updated_at timestamptz not null default now()
    )
  `;

  return true;
}

export async function verifyStoredAdminPassword(
  username: string,
  password: string,
) {
  const usernameKey = normalizeAdminUsername(username);

  if (!usernameKey || !(await ensureAdminPasswordTable())) {
    return null as boolean | null;
  }

  const sql = getSql();

  if (!sql) {
    return null as boolean | null;
  }

  const rows = await sql<AdminPasswordRow[]>`
    select password_hash
    from storefront_admin_credentials
    where username_key = ${usernameKey}
    limit 1
  `;

  if (!rows[0]) {
    return null as boolean | null;
  }

  return verifyPasswordHash(password, rows[0].password_hash);
}

export async function saveStoredAdminPassword(
  username: string,
  password: string,
) {
  const usernameKey = normalizeAdminUsername(username);

  if (!usernameKey) {
    throw new Error("Admin username is required.");
  }

  if (!(await ensureAdminPasswordTable())) {
    throw new Error("Database is not configured for admin password changes.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured for admin password changes.");
  }

  await sql`
    insert into storefront_admin_credentials (
      username_key,
      display_username,
      password_hash,
      updated_at
    )
    values (
      ${usernameKey},
      ${username.trim()},
      ${hashAdminPassword(password)},
      now()
    )
    on conflict (username_key) do update
    set
      display_username = excluded.display_username,
      password_hash = excluded.password_hash,
      updated_at = now()
  `;
}
