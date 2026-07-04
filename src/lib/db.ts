import "server-only";

import postgres, { type Sql } from "postgres";

declare global {
  var __mushroomSql: Sql | undefined;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || "";
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
      idle_timeout: 20,
      max: 1,
      prepare: false,
    });
  }

  return globalThis.__mushroomSql;
}
