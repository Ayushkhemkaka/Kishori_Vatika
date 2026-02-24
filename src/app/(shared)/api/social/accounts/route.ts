import { NextResponse } from "next/server";
import { supabase } from "@/(shared)/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    const { data: accounts } = await supabase
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
