import { NextResponse } from "next/server";
import { dbClient } from "@/app/(shared)/lib/db-client";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;
}
async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const message = body.message?.trim();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }
    const sessionId = request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? void 0;
    const { data, error } = await dbClient.from('"ContactMessage"').insert({
      name,
      email,
      phone: phone || null,
      message,
      source: "website",
      path: request.nextUrl.pathname,
      sessionId,
      ip,
      userAgent
    }).select("id").maybeSingle();
    if (error || !data) {
      throw error;
    }
    return NextResponse.json({ id: data.id, ok: true }, { status: 201 });
  } catch (err) {
    await logError({
      message: "Contact submission failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/contact"
    });
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
export { POST };

