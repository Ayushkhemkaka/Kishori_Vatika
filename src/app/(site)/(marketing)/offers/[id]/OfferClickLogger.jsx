"use client";
import { useEffect, useRef } from "react";
function OfferClickLogger({ offerId }) {
  const logged = useRef(false);
  useEffect(() => {
    if (!offerId || logged.current) return;
    logged.current = true;
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "OFFER_CLICK",
        offerId,
        path: typeof window !== "undefined" ? window.location.pathname : void 0
      }),
      credentials: "include"
    });
  }, [offerId]);
  return null;
}
export { OfferClickLogger };
