"use client";

import { useEffect, useRef } from "react";

export function OfferClickLogger({ offerId }: { offerId: string }) {
  const logged = useRef(false);

  useEffect(() => {
    if (!offerId || logged.current) return;
    logged.current = true;
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "OFFER_CLICK",
        offerId,
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
      credentials: "include",
    }).catch(() => {});
  }, [offerId]);

  return null;
}
