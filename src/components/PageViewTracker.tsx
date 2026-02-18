"use client";

import { useEffect, useRef } from "react";

export function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || typeof window === "undefined") return;
    sent.current = true;
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PAGE_VIEW",
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
