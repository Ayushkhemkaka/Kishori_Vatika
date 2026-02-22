import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { createEnquirySchema } from "@/lib/validation/enquiry";
import { errorResponse, jsonResponse } from "@/lib/api-response";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analytics";

export const runtime = "edge";

const ANALYTICS_TYPE = "ENQUIRY_SUBMITTED";

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request.headers);
    const rate = checkRateLimit(`enquiry:${identifier}`);
    if (!rate.success) {
      return errorResponse(
        "Too many enquiries. Please try again later.",
        429,
        { resetAt: rate.resetAt }
      );
    }

    const body = await request.json();
    const parsed = createEnquirySchema.safeParse({
      ...body,
      guests: typeof body.guests === "string" ? parseInt(body.guests, 10) : body.guests,
    });

    if (!parsed.success) {
      const first = parsed.error.flatten();
      return errorResponse("Validation failed", 400, {
        fieldErrors: first.fieldErrors,
      });
    }

    const data = parsed.data;

    const { data: enquiry, error } = await supabase
      .from('"Enquiry"')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
        checkIn: new Date(data.checkIn).toISOString(),
        checkOut: new Date(data.checkOut).toISOString(),
        guests: data.guests,
        source: data.source,
        offerId: data.offerId ?? null,
      })
      .select("id")
      .maybeSingle();

    if (error || !enquiry) {
      return errorResponse("Failed to create enquiry", 500);
    }

    const sessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ??
      request.cookies.get("sessionId")?.value ??
      request.headers.get("x-session-id") ??
      identifier;

    const { error: analyticsError } = await supabase
      .from('"AnalyticsEvent"')
      .insert({
        type: ANALYTICS_TYPE,
        sessionId,
        offerId: data.offerId ?? null,
        path: "/enquiry",
        metadata: {
          enquiryId: enquiry.id,
          ...(data.offerSlug && { offerSlug: data.offerSlug }),
        },
      });
    if (analyticsError) {
      console.warn("[POST /api/enquiry] analytics insert failed", analyticsError);
    }

    return jsonResponse(
      { id: enquiry.id, message: "Enquiry submitted successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/enquiry]", err);
    return errorResponse(
      "Something went wrong. Please try again later.",
      500
    );
  }
}
