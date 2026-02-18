import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SocialPlatform } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const accounts = await prisma.socialAccount.findMany({
      select: {
        id: true,
        platform: true,
        pageId: true,
        accountId: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      accounts.map((a) => ({
        id: a.id,
        platform: a.platform,
        pageId: a.pageId ?? undefined,
        accountId: a.accountId ?? undefined,
        createdAt: a.createdAt.toISOString(),
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
      platform: "FACEBOOK" | "INSTAGRAM";
      pageId?: string;
      accountId?: string;
      accessToken: string;
    };
    const { platform, pageId, accountId, accessToken } = body;
    if (
      !platform ||
      !["FACEBOOK", "INSTAGRAM"].includes(platform) ||
      !accessToken?.trim()
    ) {
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

    const existing = await prisma.socialAccount.findFirst({
      where: { platform: platform as SocialPlatform },
    });

    const data = {
      platform: platform as SocialPlatform,
      pageId: platform === "FACEBOOK" ? pageId!.trim() : null,
      accountId: platform === "INSTAGRAM" ? accountId!.trim() : null,
      accessToken: accessToken.trim(),
    };

    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data,
      });
      return NextResponse.json({
        id: existing.id,
        platform,
        message: "Account updated",
      });
    }

    const created = await prisma.socialAccount.create({ data });
    return NextResponse.json({
      id: created.id,
      platform,
      message: "Account connected",
    });
  } catch (e) {
    console.error("Social connect error:", e);
    return NextResponse.json(
      { error: "Failed to save account" },
      { status: 500 }
    );
  }
}
