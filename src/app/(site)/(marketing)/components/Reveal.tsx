"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fades and lifts its children into place the first time they scroll into
 * view, then gets out of the way for good.
 *
 * Deliberately one-shot: content that re-animates every time it crosses the
 * viewport draws attention to the mechanism instead of the page. The observer
 * disconnects on the first hit, and anything that cannot observe (an old
 * browser, a crawler) is shown immediately rather than left invisible.
 *
 * `prefers-reduced-motion` is handled in CSS, so the markup is identical
 * either way.
 */
export function Reveal({
  children,
  /** Milliseconds behind its neighbours, for staggering a list. */
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Fire a little before the block is fully on screen, so the movement has
    // finished by the time the reader's eye arrives.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`kv-reveal${visible ? " is-visible" : ""} ${className}`.trim()}
      style={{ "--kv-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
