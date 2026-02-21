import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

const pool =
  connectionString && (globalForPrisma.prismaPool ?? new Pool({ connectionString }));

if (connectionString && process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaPool = pool;
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg(pool as Pool),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

export const prisma: PrismaClient = connectionString
  ? globalForPrisma.prisma ?? createPrismaClient()
  : (new Proxy(
      {},
      {
        get() {
          throw new Error("DATABASE_URL is required to initialize Prisma");
        },
      }
    ) as PrismaClient);

if (connectionString && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
