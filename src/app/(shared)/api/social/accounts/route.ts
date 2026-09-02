import { NextResponse } from "next/server";
import { dbClient as db } from "@/app/(shared)/lib/db-client";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data: accounts } = await db
      .from('"SocialAccount"')
      .select("id,platform,pageId,accountId,expiresAt,createdAt");

    return NextResponse.json(
      (accounts ?? []).map((a) => ({
        id: a.id,
        platform: a.platform,
        pageId: a.pageId ?? undefined,
        accountId: a.accountId ?? undefined,
        expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString() : undefined,
        createdAt: new Date(a.createdAt).toISOString(),
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
