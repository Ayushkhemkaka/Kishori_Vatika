import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/(shared)/lib/supabase";
import { ANALYTICS_SESSION_COOKIE } from "@/(shared)/lib/analytics";
import { logError } from "@/(shared)/lib/audit";

export const runtime = "edge";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
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
    const body = (await request.json()) as ContactPayload;
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

    const sessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const { data, error } = await supabase
      .from('"ContactMessage"')
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        source: "website",
        path: request.nextUrl.pathname,
        sessionId,
        ip,
        userAgent,
      })
      .select("id")
      .maybeSingle();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json({ id: data.id, ok: true }, { status: 201 });
  } catch (err) {
    await logError({
      message: "Contact submission failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/contact",
    });
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
