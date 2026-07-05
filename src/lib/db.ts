import "server-only";

import postgres, { type Sql } from "postgres";

declare global {
  var __mushroomSql: Sql | undefined;
}

const DATABASE_URL_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

function normalizeDatabaseUrl(value: string | undefined) {
  let trimmedValue = value?.trim() ?? "";

  while (
    trimmedValue.length >= 2 &&
    ((trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
      (trimmedValue.startsWith("'") && trimmedValue.endsWith("'")))
  ) {
    trimmedValue = trimmedValue.slice(1, -1).trim();
  }

  return trimmedValue;
}

function isPostgresUrl(value: string) {
  return /^postgres(?:ql)?:\/\//i.test(value);
}

export function getDatabaseUrl() {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = normalizeDatabaseUrl(process.env[key]);

    if (value && isPostgresUrl(value)) {
      return value;
    }
  }

  return "";
}

export function isDatabaseConfigured() {
  return getDatabaseUrl().length > 0;
}

export function getSql() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!globalThis.__mushroomSql) {
    globalThis.__mushroomSql = postgres(getDatabaseUrl(), {
      connect_timeout: 5,
      idle_timeout: 20,
      max: 1,
      max_lifetime: 60 * 5,
      prepare: false,
    });
  }

  return globalThis.__mushroomSql;
}
