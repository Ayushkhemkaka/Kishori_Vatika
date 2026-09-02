import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/(shared)/lib/supabase";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";

export const runtime = "edge";

type NewsletterPayload = {
  email?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const sessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;

    const { data, error } = await supabase
      .from('"NewsletterSignup"')
      .upsert(
        {
          email,
          source: "website",
          sessionId,
        },
        { onConflict: "email" }
      )
      .select("id")
      .maybeSingle();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json({ id: data.id, ok: true }, { status: 201 });
  } catch (err) {
    await logError({
      message: "Newsletter signup failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/newsletter",
    });
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

