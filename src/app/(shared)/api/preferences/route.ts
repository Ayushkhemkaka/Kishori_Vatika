import { NextRequest, NextResponse } from "next/server";
import { dbClient as db } from "@/app/(shared)/lib/db-client";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
import { logError } from "@/app/(shared)/lib/audit";

export const runtime = "nodejs";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type PreferencePayload = {
  key?: string;
  value?: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const maybe = err as { message?: unknown; error?: unknown };
    if (typeof maybe.message === "string") return maybe.message;
    if (typeof maybe.error === "string") return maybe.error;
    try {
      return JSON.stringify(err);
    } catch {
      return "Unknown error";
    }
  }
  return "Unknown error";
}

export async function POST(request: NextRequest) {
  try {
    const existingSessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;
    const sessionId = existingSessionId ?? crypto.randomUUID();

    const body = (await request.json()) as PreferencePayload;
    const key = body.key?.trim();
    const value = body.value?.trim();
    if (!key || value == null) {
      return NextResponse.json(
        { error: "key and value are required" },
        { status: 400 }
      );
    }

    const { data: existingPref, error: existingPrefError } = await db
      .from('UserPreference')
      .select("id")
      .eq("sessionId", sessionId)
      .eq("key", key)
      .maybeSingle();

    if (existingPrefError) {
      throw existingPrefError;
    }

    let savedId: string | null = null;

    if (existingPref?.id) {
      const { error: updateError } = await db
        .from('UserPreference')
        .update({
          value,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingPref.id);

      if (updateError) {
        throw updateError;
      }
      savedId = existingPref.id;
    } else {
      const { error: insertError } = await db
        .from('UserPreference')
        .insert({
          sessionId,
          key,
          value,
          updatedAt: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      const { data: createdPref, error: createdPrefError } = await db
        .from('UserPreference')
        .select("id")
        .eq("sessionId", sessionId)
        .eq("key", key)
        .maybeSingle();

      if (createdPrefError) {
        throw createdPrefError;
      }
      if (!createdPref?.id) {
        throw new Error("Preference saved but id could not be resolved");
      }
      savedId = createdPref.id;
    }

    const response = NextResponse.json({ id: savedId, ok: true }, { status: 201 });
    if (!existingSessionId) {
      response.cookies.set(ANALYTICS_SESSION_COOKIE, sessionId, {
        path: "/",
        maxAge: SESSION_MAX_AGE,
        sameSite: "lax",
        httpOnly: false,
      });
    }

    return response;
  } catch (err) {
    const message = getErrorMessage(err);

    await logError({
      message: "Preference update failed",
      stack: err instanceof Error ? err.stack : String(err),
      path: "/api/preferences",
      context: { error: message },
    });

    return NextResponse.json(
      { error: "Failed to save preference", reason: message },
      { status: 500 }
    );
  }
}
