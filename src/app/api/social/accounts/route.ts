import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const accounts = await prisma.socialAccount.findMany({
      select: {
        id: true,
        platform: true,
        pageId: true,
        accountId: true,
        expiresAt: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      accounts.map((a) => ({
        id: a.id,
        platform: a.platform,
        pageId: a.pageId ?? undefined,
        accountId: a.accountId ?? undefined,
        expiresAt: a.expiresAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      }))
    );
  } catch (e) {
    console.error("Social accounts list error:", e);
    return NextResponse.json(
      { error: "Failed to list social accounts" },
      { status: 500 }
    );
  }
}
