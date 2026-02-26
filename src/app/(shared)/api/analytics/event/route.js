import { NextResponse } from "next/server";
import { dbClient } from "@/app/(shared)/lib/db-client";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
const VALID_TYPES = ["PAGE_VIEW", "OFFER_CLICK", "ENQUIRY_SUBMITTED"];
function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;
}
async function POST(request) {
  try {
    const sessionId = request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 });
    }
    const body = await request.json();
    const { type, offerId, path, metadata } = body;
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid or missing event type" },
        { status: 400 }
      );
    }
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? void 0;
    const eventPath = typeof path === "string" ? path : void 0;
    const eventOfferId = typeof offerId === "string" && offerId.length > 0 ? offerId : void 0;
    await dbClient.from('"Visitor"').upsert(
      {
        sessionId,
        ip: ip ?? null,
        userAgent,
        lastPath: eventPath ?? request.nextUrl.pathname,
        lastSeenAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      { onConflict: "sessionId" }
    );
    if (type === "PAGE_VIEW") {
      await dbClient.from('"Visit"').insert({
        sessionId,
        ip: ip ?? null,
        userAgent,
        path: eventPath ?? request.nextUrl.pathname
      });
    }
    await dbClient.from('"AnalyticsEvent"').insert({
      type,
      sessionId,
      path: eventPath,
      offerId: eventOfferId ?? null,
      metadata: metadata ?? null
    });
    if (type === "OFFER_CLICK" && eventOfferId) {
      await dbClient.from('"UserPreference"').upsert(
        {
          sessionId,
          key: "last_offer_id",
          value: eventOfferId,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "sessionId,key" }
      );
    }
  } catch (err) {
    console.error("Analytics event error:", err);
    await logError({
      message: "Analytics event failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/analytics/event"
    });
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
export { POST };

