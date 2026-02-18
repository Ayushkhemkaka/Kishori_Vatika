import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analytics";
import type { AnalyticsType } from "@prisma/client";

const VALID_TYPES: AnalyticsType[] = ["PAGE_VIEW", "OFFER_CLICK", "ENQUIRY_SUBMITTED"];

function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  );
}

export async function POST(request: NextRequest) {
  try {
    const sessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, offerId, path, metadata } = body as {
      type?: string;
      offerId?: string;
      path?: string;
      metadata?: Record<string, unknown>;
    };

    if (!type || !VALID_TYPES.includes(type as AnalyticsType)) {
      return NextResponse.json(
        { error: "Invalid or missing event type" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const eventPath = typeof path === "string" ? path : undefined;
    const eventOfferId =
      typeof offerId === "string" && offerId.length > 0 ? offerId : undefined;
    const eventMetadata =
      metadata && typeof metadata === "object" ? metadata : undefined;

    if (type === "PAGE_VIEW") {
      await prisma.visit.create({
        data: {
          sessionId,
          ip: ip ?? undefined,
          userAgent,
          path: eventPath ?? request.nextUrl.pathname,
        },
      });
    }

    await prisma.analyticsEvent.create({
      data: {
        type: type as AnalyticsType,
        sessionId,
        path: eventPath,
        offerId: eventOfferId,
        metadata: eventMetadata ?? undefined,
      },
    });
  } catch (err) {
    console.error("Analytics event error:", err);
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
