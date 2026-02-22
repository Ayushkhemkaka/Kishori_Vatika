"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();
  const logged = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || logged.current === pathname) return;
    logged.current = pathname;
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PAGE_VIEW",
        path: pathname,
      }),
      credentials: "include",
    });
  }, [pathname]);

  return null;
}
