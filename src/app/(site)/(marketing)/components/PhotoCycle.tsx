"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const CYCLE_MS = 6000;

type PhotoCycleProps = {
  images: string[];
  alt: string;
  sizes?: string;
  className?: string;
  /** Staggers the first change so a grid of cards does not flip in unison. */
  offsetMs?: number;
};

/**
 * Card cover that crossfades through every photo it is given.
 *
 * Deliberately control-free: these covers sit inside links, where arrows and
 * counters would compete with the click target. Where a visitor should be
 * able to drive the photos - the banner, the room and facility detail pages -
 * ImageCarousel is the right component instead.
 *
 * The parent owns the box (it must be `relative`); every frame is absolutely
 * positioned and filled, so a portrait photo cannot resize the card.
 */
export function PhotoCycle({
  images,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
  offsetMs = 0,
}: PhotoCycleProps) {
  const slides = images.length > 0 ? images : ["/hero-hotel.jpg"];
  const hasMultiple = slides.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!hasMultiple) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(
        () => setActiveIndex((prev) => (prev + 1) % slides.length),
        CYCLE_MS
      );
    }, offsetMs);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [hasMultiple, slides.length, offsetMs]);

  return (
    <>
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          fill
          sizes={sizes}
          aria-hidden={i !== activeIndex}
          className={`object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          } ${className}`}
          priority={i === 0}
        />
      ))}
    </>
  );
}
