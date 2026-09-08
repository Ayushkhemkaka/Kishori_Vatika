"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CarouselArrow } from "./CarouselArrow";

/**
 * @param {{
 *   images?: string[],
 *   title: string,
 *   className?: string,
 *   containerClassName?: string,
 *   counterClassName?: string,
 *   sizes?: string,
 * }} props
 */
export function ImageCarousel({
  images = [],
  title,
  className = "",
  containerClassName = "",
  // Where the "2 / 5" counter sits. Callers that lay their own caption over
  // the photo move it out of the way rather than fight it for the corner.
  counterClassName = "bottom-4 right-4",
  sizes = "(min-width: 1024px) 60vw, 100vw",
}) {
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) {
      return ["/hero-hotel.jpg"];
    }
    return images;
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = normalizedImages.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedImages]);

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
      // Paced with the banner (7s) and the card covers (6s) so nothing on a
      // page changes on a visibly different clock.
    }, 8000);

    return () => clearInterval(timer);
  }, [hasMultiple, normalizedImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrevClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    goPrev();
  };

  const handleNextClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    goNext();
  };

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const handleGlobalKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [hasMultiple, goPrev, goNext]);

  const handleKeyDown = (event) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <div
      // The container owns the box: its size comes from `containerClassName`,
      // never from the photo. Frame (rounding, border) is the caller's too, so
      // the carousel can sit flush inside a larger card.
      className={`group relative overflow-hidden bg-emerald-50 ${containerClassName}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${title} image carousel`}
    >
      {/* `fill` takes the image out of flow and stretches it to the container,
          so a portrait or square photo cannot resize the box; object-cover
          crops whatever overflows instead of letterboxing it. */}
      <Image
        src={normalizedImages[activeIndex]}
        alt={`${title} image ${activeIndex + 1}`}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
        priority
      />

      {hasMultiple ? (
        <>
          <div className={`pointer-events-none absolute rounded-full ${counterClassName} border border-emerald-200 bg-black/65 px-3 py-1 text-xs font-semibold text-white`}>
            {activeIndex + 1} / {normalizedImages.length}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            {/* The banner arrow, revealed on hover. A light scrim rides under
                it because a card photo has no veil of its own to sit on. */}
            <CarouselArrow
              direction="prev"
              onClick={handlePrevClick}
              label={`Previous ${title} image`}
              className="pointer-events-auto bg-black/20 opacity-0 backdrop-blur-[2px] duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            />
            <CarouselArrow
              direction="next"
              onClick={handleNextClick}
              label={`Next ${title} image`}
              className="pointer-events-auto bg-black/20 opacity-0 backdrop-blur-[2px] duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
