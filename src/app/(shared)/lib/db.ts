import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

/**
 * The Hostinger MySQL credentials are supplied as discrete DB_* parts.
 * Prisma only reads DATABASE_URL, so assemble one when it is absent.
 */
function buildDatabaseUrlFromParts(): string | null {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST ?? "localhost";
  const port = process.env.DB_PORT ?? "3306";
  const database = process.env.DB_DATABASE;

  if (!user || !password || !database) return null;

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${host}:${port}/${database}`;
}

function appendSslAccept(url: string): string {
  const sslAccept = process.env.DB_SSL_ACCEPT;
  if (!sslAccept) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sslaccept=${encodeURIComponent(sslAccept)}`;
}

if (!process.env.DATABASE_URL) {
  const built = buildDatabaseUrlFromParts();
  if (built) process.env.DATABASE_URL = appendSslAccept(built);
}

/**
 * If the client cannot be constructed (missing credentials, unreachable host),
 * hand back a stand-in whose queries reject instead of throwing at import time.
 * That keeps a page render failing locally rather than crashing the whole app.
 */
function createFallbackPrisma(error: unknown): PrismaClient {
  const rejecting = () =>
    new Proxy(() => Promise.reject(error), {
      apply: () => Promise.reject(error),
    });

  console.error("Prisma client initialization failed", error);

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "$connect" || prop === "$disconnect") {
          return async () => {};
        }
        if (prop === "$on") return () => undefined;
        return new Proxy({}, { get: () => rejecting() });
      },
    }
  ) as PrismaClient;
}

let prisma: PrismaClient;
try {
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (error) {
  prisma = createFallbackPrisma(error);
}

export { prisma };
