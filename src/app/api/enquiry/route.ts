import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createEnquirySchema } from "@/lib/validation/enquiry";
import { errorResponse, jsonResponse } from "@/lib/api-response";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { AnalyticsType } from "@prisma/client";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analytics";

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

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        source: data.source,
        offerId: data.offerId ?? null,
      },
    });

    const sessionId =
      request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value ??
      request.cookies.get("sessionId")?.value ??
      request.headers.get("x-session-id") ??
      identifier;

    await prisma.analyticsEvent.create({
      data: {
        type: AnalyticsType.ENQUIRY_SUBMITTED,
        sessionId,
        offerId: data.offerId ?? null,
        path: "/enquiry",
        metadata: {
          enquiryId: enquiry.id,
          ...(data.offerSlug && { offerSlug: data.offerSlug }),
        },
      },
    }).catch(() => {});

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
