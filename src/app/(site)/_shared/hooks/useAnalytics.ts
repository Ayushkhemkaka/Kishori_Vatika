"use client";

import { useCallback } from "react";
import type { AnalyticsEventPayload } from "@/(shared)/lib/analytics";

export function useAnalytics() {
  const track = useCallback((payload: AnalyticsEventPayload) => {
    if (typeof window === "undefined") return;
    const path = payload.path ?? window.location.pathname;
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, path }),
      keepalive: true,
    });
  }, []);

  const trackPageView = useCallback(
    (path?: string) =>
      track({ type: "PAGE_VIEW", path: path ?? undefined }),
    [track]
  );

  const trackOfferClick = useCallback(
    (offerId: string, path?: string) =>
      track({ type: "OFFER_CLICK", offerId, path }),
    [track]
  );

  const trackEnquirySubmitted = useCallback(
    (offerId?: string, metadata?: Record<string, unknown>) =>
      track({
        type: "ENQUIRY_SUBMITTED",
        offerId,
        path: "/enquiry",
        metadata,
      }),
    [track]
  );

  return { track, trackPageView, trackOfferClick, trackEnquirySubmitted };
}
