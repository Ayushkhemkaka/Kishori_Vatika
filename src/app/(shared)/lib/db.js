import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function buildDatabaseUrlFromParts() {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST ?? "localhost";
  const port = process.env.DB_PORT ?? "3306";
  const database = process.env.DB_DATABASE;
  const sslAccept = process.env.DB_SSL_ACCEPT;

  if (!user || !password || !database) {
    return null;
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

function appendSslAccept(url) {
  const sslAccept = process.env.DB_SSL_ACCEPT;
  if (!sslAccept) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sslaccept=${encodeURIComponent(sslAccept)}`;
}

if (!process.env.DATABASE_URL) {
  const built = buildDatabaseUrlFromParts();
  if (built) {
    process.env.DATABASE_URL = appendSslAccept(built);
  }
}

let prisma;
function createFallbackPrisma(error) {
  const createRejectingProxy = () =>
    new Proxy(
      () => Promise.reject(error),
      {
        apply() {
          return Promise.reject(error);
        }
      }
    );

  const handler = {
    get(target, prop) {
      if (prop === "$connect" || prop === "$disconnect") {
        return async () => {
          return Promise.resolve();
        };
      }
      if (prop === "$on") {
        return () => void 0;
      }
      // Return a proxy that resolves any deeper call into a rejecting promise
      return new Proxy(
        {},
        {
          get() {
            return createRejectingProxy();
          }
        }
      );
    }
  };
  console.error("Prisma client initialization failed", error);
  return new Proxy({}, handler);
}

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (error) {
  prisma = createFallbackPrisma(error);
}

export { prisma };
