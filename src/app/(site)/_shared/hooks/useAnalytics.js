"use client";
import { useCallback } from "react";
function useAnalytics() {
  const track = useCallback((payload) => {
    if (typeof window === "undefined") return;
    const path = payload.path ?? window.location.pathname;
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, path }),
      keepalive: true
    });
  }, []);
  const trackPageView = useCallback(
    (path) => track({ type: "PAGE_VIEW", path: path ?? void 0 }),
    [track]
  );
  const trackOfferClick = useCallback(
    (offerId, path) => track({ type: "OFFER_CLICK", offerId, path }),
    [track]
  );
  const trackEnquirySubmitted = useCallback(
    (offerId, metadata) => track({
      type: "ENQUIRY_SUBMITTED",
      offerId,
      path: "/enquiry",
      metadata
    }),
    [track]
  );
  return { track, trackPageView, trackOfferClick, trackEnquirySubmitted };
}
export { useAnalytics };
