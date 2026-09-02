"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const ROTATE_MS = 6000;

type HeroCarouselProps = {
  images: string[];
  /** Seconds between slides. */
  intervalMs?: number;
  children?: React.ReactNode;
};

/**
 * Full-bleed photo banner for the top of the home page.
 *
 * Slides crossfade rather than slide so the overlaid text stays readable, and
 * every image is stacked in the DOM at all times — only opacity changes — which
 * keeps the transition free of layout work.
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
      className="kv-full-bleed relative isolate h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-900 sm:h-[80vh]"
      aria-roledescription="carousel"
      aria-label="Kishori Vatika photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!reducedMotion.current) setPaused(false);
      }}
    >
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
          aria-hidden={i !== activeIndex}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Scrim keeps the headline legible over any photo. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />

      <div className="relative z-10 flex h-full items-center">
        <div className="kv-container w-full">{children}</div>
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:bg-black/70 sm:left-6"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:bg-black/70 sm:right-6"
          >
            &#8594;
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === activeIndex}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "w-7 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
