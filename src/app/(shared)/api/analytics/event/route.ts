import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/(shared)/lib/supabase";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";

export const runtime = "edge";

const VALID_TYPES = ["PAGE_VIEW", "OFFER_CLICK", "ENQUIRY_SUBMITTED"] as const;

type AnalyticsType = (typeof VALID_TYPES)[number];

type AnalyticsPayload = {
  type?: string;
  offerId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

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
      return NextResponse.json({ error: "Missing session" }, { status: 400 });
    }

    const body = (await request.json()) as AnalyticsPayload;
    const { type, offerId, path, metadata } = body;

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

    await supabase.from('"Visitor"').upsert(
      {
        sessionId,
        ip: ip ?? null,
        userAgent,
        lastPath: eventPath ?? request.nextUrl.pathname,
        lastSeenAt: new Date().toISOString(),
      },
      { onConflict: "sessionId" }
    );

    if (type === "PAGE_VIEW") {
      await supabase.from('"Visit"').insert({
        sessionId,
        ip: ip ?? null,
        userAgent,
        path: eventPath ?? request.nextUrl.pathname,
      });
    }

    await supabase.from('"AnalyticsEvent"').insert({
      type: type as AnalyticsType,
      sessionId,
      path: eventPath,
      offerId: eventOfferId ?? null,
      metadata: metadata ?? null,
    });

    if (type === "OFFER_CLICK" && eventOfferId) {
      await supabase.from('"UserPreference"').upsert(
        {
          sessionId,
          key: "last_offer_id",
          value: eventOfferId,
          updatedAt: new Date().toISOString(),
        },
        { onConflict: "sessionId,key" }
      );
    }
  } catch (err) {
    console.error("Analytics event error:", err);
    await logError({
      message: "Analytics event failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/analytics/event",
    });
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

