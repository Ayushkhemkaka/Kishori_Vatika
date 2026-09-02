"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const ROTATE_MS = 7000;

type HeroCarouselProps = {
  images: string[];
  intervalMs?: number;
  children?: React.ReactNode;
};

/**
 * Full-bleed photo banner for the top of the home page.
 *
 * Slides crossfade and drift slowly (a Ken Burns move) so the banner feels
 * alive without distracting from the copy. A single even scrim sits over the
 * photo — a directional gradient reads as a dirty band across the image, so
 * contrast comes from one uniform veil plus a soft vignette instead.
 */
export function HeroCarousel({
  images,
  intervalMs = ROTATE_MS,
  children,
}: HeroCarouselProps) {
  const slides = images.length > 0 ? images : ["/hero-hotel.jpg"];
  const hasMultiple = slides.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    if (query.matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % slides.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [hasMultiple, paused, slides.length, intervalMs]);

  const go = useCallback(
    (delta: number) =>
      setActiveIndex((prev) => (prev + delta + slides.length) % slides.length),
    [slides.length]
  );

  return (
    <section
      className="kv-full-bleed relative isolate flex h-[92vh] min-h-[560px] w-full items-center overflow-hidden bg-stone-950"
      aria-roledescription="carousel"
      aria-label="Kishori Vatika photos"
    >
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
          aria-hidden={i !== activeIndex}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover ${
              i === activeIndex ? "kv-hero-zoom" : ""
            }`}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Contrast is built in three passes, all edgeless so the photo never
          shows a gradient seam:
          1. an even veil over the whole image,
          2. a soft pool of shade centred on the copy — the text sits in the
             middle, so this is where contrast is actually needed,
          3. a gentle darkening at top and bottom for the header and controls. */}
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.35)_45%,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/45" />

      <div className="relative z-10 w-full">
        <div className="kv-container">{children}</div>
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="group absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:text-white sm:flex lg:left-8"
          >
            <span className="absolute inset-0 rounded-full border border-white/25 transition group-hover:border-white/60" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="group absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:text-white sm:flex lg:right-8"
          >
            <span className="absolute inset-0 rounded-full border border-white/25 transition group-hover:border-white/60" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Hairline progress marks rather than dots. */}
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === activeIndex}
                className={`h-px w-10 transition-all duration-500 ${
                  i === activeIndex ? "bg-white" : "bg-white/35 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
