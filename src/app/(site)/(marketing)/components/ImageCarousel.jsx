"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export function ImageCarousel({ images = [], title, className = "", containerClassName = "" }) {
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
    }, 30000);

    return () => clearInterval(timer);
  }, [hasMultiple, normalizedImages.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
  };

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
      className={`relative overflow-hidden rounded-3xl border border-emerald-100 bg-white ${containerClassName}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${title} image carousel`}
    >
      <Image
        src={normalizedImages[activeIndex]}
        alt={`${title} image ${activeIndex + 1}`}
        width={1600}
        height={1000}
        className={className}
        priority
      />

      {hasMultiple ? (
        <>
          <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-emerald-200 bg-black/65 px-3 py-1 text-xs font-semibold text-white">
            {activeIndex + 1} / {normalizedImages.length}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={handlePrevClick}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-black/60 text-white transition hover:bg-black/80"
              aria-label={`Previous ${title} image`}
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-black/60 text-white transition hover:bg-black/80"
              aria-label={`Next ${title} image`}
            >
              &#8594;
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
