import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/(shared)/lib/supabase";
import { logAdminActivity, logError } from "@/(shared)/lib/audit";

export const runtime = "edge";

type Platform = "FACEBOOK" | "INSTAGRAM";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = (session.user as { id?: string }).id ?? null;
  try {
    const { data: accounts } = await supabase
      .from('"SocialAccount"')
      .select("id,platform,pageId,accountId,createdAt");

    return NextResponse.json(
      (accounts ?? []).map((a) => ({
        id: a.id,
        platform: a.platform,
        pageId: a.pageId ?? undefined,
        accountId: a.accountId ?? undefined,
        createdAt: new Date(a.createdAt).toISOString(),
      }))
    );
  } catch (e) {
    console.error("Social list error:", e);
    return NextResponse.json(
      { error: "Failed to list accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      platform: Platform;
      pageId?: string;
      accountId?: string;
      accessToken: string;
    };
    const { platform, pageId, accountId, accessToken } = body;
    if (!platform || !["FACEBOOK", "INSTAGRAM"].includes(platform)) {
      return NextResponse.json(
        { error: "platform and accessToken required" },
        { status: 400 }
      );
    }
    if (!accessToken?.trim()) {
      return NextResponse.json(
        { error: "platform and accessToken required" },
        { status: 400 }
      );
    }
    if (platform === "FACEBOOK" && !pageId?.trim()) {
      return NextResponse.json(
        { error: "pageId required for Facebook" },
        { status: 400 }
      );
    }
    if (platform === "INSTAGRAM" && !accountId?.trim()) {
      return NextResponse.json(
        { error: "accountId required for Instagram" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('"SocialAccount"')
      .select("id")
      .eq("platform", platform)
      .maybeSingle();

    const data = {
      platform,
      pageId: platform === "FACEBOOK" ? pageId!.trim() : null,
      accountId: platform === "INSTAGRAM" ? accountId!.trim() : null,
      accessToken: accessToken.trim(),
    };

    if (existing) {
      await supabase.from('"SocialAccount"').update(data).eq("id", existing.id);
      await logAdminActivity({
        adminId,
        action: "social.update",
        entity: "SocialAccount",
        entityId: existing.id,
        metadata: { platform },
      });
      return NextResponse.json({
        id: existing.id,
        platform,
        message: "Account updated",
      });
    }

    const { data: created } = await supabase
      .from('"SocialAccount"')
      .insert(data)
      .select("id")
      .maybeSingle();

    if (created?.id) {
      await logAdminActivity({
        adminId,
        action: "social.connect",
        entity: "SocialAccount",
        entityId: created.id,
        metadata: { platform },
      });
    }

    return NextResponse.json({
      id: created?.id,
      platform,
      message: "Account connected",
    });
  } catch (e) {
    console.error("Social connect error:", e);
    await logError({
      message: "Social connect failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/social/connect",
      context: { adminId },
    });
    return NextResponse.json(
      { error: "Failed to save account" },
      { status: 500 }
    );
  }
}
