import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
function buildDatabaseUrlFromParts() {
  const user = process.env.db_user ?? process.env.DB_USER;
  const password = process.env.db_password ?? process.env.DB_PASSWORD;
  const host = process.env.db_host ?? process.env.DB_HOST ?? "localhost";
  const port = process.env.db_port ?? process.env.DB_PORT ?? "3306";
  const database = process.env.db_database ?? process.env.db_dbatabase ?? process.env.DB_DATABASE ?? process.env.DB_DBATABASE;
  if (!user || !password || !database) return null;
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}
if (!process.env.DATABASE_URL) {
  const built = buildDatabaseUrlFromParts();
  if (built) {
    process.env.DATABASE_URL = built;
  }
}
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DB config. Provide db_user, db_password, db_port, db_database");
}
const prisma = new PrismaClient();
async function main() {
  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@Kishorivilla.com";
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "changeme";
  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail }
  });
  if (!existingOwner) {
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    await prisma.user.create({
      data: {
        email: ownerEmail,
        name: "Hotel Owner",
        role: UserRole.OWNER,
        password: hashedPassword
      }
    });
    console.log(`Created owner user: ${ownerEmail}`);
  } else {
    console.log(`Owner already exists: ${ownerEmail}`);
  }
  const offerCount = await prisma.offer.count();
  if (offerCount === 0) {
    const now = /* @__PURE__ */ new Date();
    const validFrom = new Date(now);
    const validTo = new Date(now);
    validTo.setMonth(validTo.getMonth() + 3);
    await prisma.offer.create({
      data: {
        title: "Weekend Getaway",
        description: "Two nights with breakfast, late checkout, and a complimentary bonfire dinner. Perfect for a short escape.",
        price: 8999,
        validFrom,
        validTo,
        isActive: true,
        features: {
          create: [
            { label: "Breakfast", value: "Daily" },
            { label: "Late checkout", value: "12 noon" },
            { label: "Bonfire dinner", value: "One night" }
          ]
        }
      }
    });
    await prisma.offer.create({
      data: {
        title: "Work from the Hills",
        description: "Five nights with dedicated workspace, high-speed Wi\u2011Fi, and daily coffee. Ideal for remote work with a view.",
        price: 24999,
        validFrom,
        validTo,
        isActive: true,
        features: {
          create: [
            { label: "Breakfast", value: "Daily" },
            { label: "Workspace", value: "In-room or deck" },
            { label: "Wi\u2011Fi", value: "High-speed" }
          ]
        }
      }
    });
    console.log("Created sample offers.");
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
