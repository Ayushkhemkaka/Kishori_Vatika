import { NextResponse } from "next/server";
import { supabase } from "@/app/(shared)/lib/supabase";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
async function POST(request) {
  try {
    const sessionId = request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 });
    }
    const body = await request.json();
    const key = body.key?.trim();
    const value = body.value?.trim();
    if (!key || value == null) {
      return NextResponse.json(
        { error: "key and value are required" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase.from('"UserPreference"').upsert(
      {
        sessionId,
        key,
        value,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      { onConflict: "sessionId,key" }
    ).select("id").maybeSingle();
    if (error || !data) {
      throw error;
    }
    return NextResponse.json({ id: data.id, ok: true }, { status: 201 });
  } catch (err) {
    await logError({
      message: "Preference update failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/preferences"
    });
    return NextResponse.json(
      { error: "Failed to save preference" },
      { status: 500 }
    );
  }
}
export { POST };
