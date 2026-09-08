type CarouselArrowProps = {
  direction: "prev" | "next";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  /** Positioning and any per-carousel treatment (scrim, reveal-on-hover). */
  className?: string;
};

/**
 * The site's one carousel arrow: a thin chevron inside a hairline ring, with
 * no filled disc. Shared by the home banner and the in-card carousels so the
 * control reads the same wherever photos rotate.
 */
export function CarouselArrow({
  direction,
  onClick,
  label,
  className = "",
}: CarouselArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      /* No `relative` here. Callers position this button with `absolute`, and
         both are position utilities - which one wins depends on Tailwind's
         generated order, not the class order, so a `relative` in the base
         would drop every arrow back into the flow. The ring is therefore a
         border on the button itself rather than a positioned child. */
      className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/60 transition hover:border-white/60 hover:text-white ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
