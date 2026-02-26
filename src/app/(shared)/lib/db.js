import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function buildDatabaseUrlFromParts() {
  const user = process.env.db_user ?? process.env.DB_USER;
  const password = process.env.db_password ?? process.env.DB_PASSWORD;
  const host = process.env.db_host ?? process.env.DB_HOST ?? "localhost";
  const port = process.env.db_port ?? process.env.DB_PORT ?? "3306";
  const database =
    process.env.db_database ??
    process.env.db_dbatabase ??
    process.env.DB_DATABASE ??
    process.env.DB_DBATABASE;

  if (!user || !password || !database) {
    return null;
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

if (!process.env.DATABASE_URL) {
  const built = buildDatabaseUrlFromParts();
  if (built) {
    process.env.DATABASE_URL = built;
  }
}

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
