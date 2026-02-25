import { NextResponse } from "next/server";
import { supabase } from "@/app/(shared)/lib/supabase";
export const runtime = "edge";
async function GET() {
  try {
    const { data: accounts } = await supabase.from('"SocialAccount"').select("id,platform,pageId,accountId,expiresAt,createdAt");
    return NextResponse.json(
      (accounts ?? []).map((a) => ({
        id: a.id,
        platform: a.platform,
        pageId: a.pageId ?? void 0,
        accountId: a.accountId ?? void 0,
        expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString() : void 0,
        createdAt: new Date(a.createdAt).toISOString()
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
export { GET };
