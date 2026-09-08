import type { ReactElement } from "react";

/**
 * The small line icons that sit beside a spec on a catalogue card.
 *
 * Rooms and facilities describe themselves in free text ("Queen bed", "Up to
 * 3 guests", "7:00 am - 11:00 pm"), so rather than ask every data file to name
 * an icon, the label picks its own by keyword. Anything unrecognised falls
 * back to a neutral tick, which is why an unmatched spec still looks
 * deliberate rather than broken.
 */
const PATHS: Record<string, ReactElement> = {
  bed: (
    <>
      <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
      <path d="M3 14h18M3 18h18M7 8V6" />
      <circle cx="8" cy="11" r="1.6" />
    </>
  ),
  guests: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5M17 19a5.5 5.5 0 0 0-2-4" />
    </>
  ),
  size: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a15 15 0 0 1 19 0M6 12.5a10 10 0 0 1 12 0M9.5 16a5 5 0 0 1 5 0" />
      <circle cx="12" cy="19.5" r="1" />
    </>
  ),
  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  pool: (
    <>
      <path d="M2 17c2 0 2.5 1.5 5 1.5S9.5 17 12 17s2.5 1.5 5 1.5 2.5-1.5 5-1.5" />
      <path d="M7 15V5.5A2.5 2.5 0 0 1 12 5M17 15V5.5A2.5 2.5 0 0 0 12 5M7 9h10" />
    </>
  ),
  cool: (
    <>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </>
  ),
  dining: (
    <>
      <path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M17 3c-1.5 1.5-2 3.5-2 6 0 1.7.7 2.6 2 3v9" />
    </>
  ),
  service: (
    <>
      <path d="M6 17V12a6 6 0 0 1 12 0v5M4 17h16M10 20h4M12 6V4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  access: (
    <>
      <circle cx="8" cy="13" r="4" />
      <path d="M11 11l8-8 2 2-2 2 2 2-3 3-2-2-2 2" />
    </>
  ),
  event: (
    <>
      <path d="M12 3l2.2 4.8L19 10l-4.8 2.2L12 17l-2.2-4.8L5 10l4.8-2.2z" />
      <path d="M18.5 16.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" />
    </>
  ),
  tick: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
};

// First match wins, so put the narrow words before the broad ones: "pool
// table" should read as a pool, and "work desk" as a screen, not as furniture.
const KEYWORDS: [RegExp, keyof typeof PATHS][] = [
  [/wi-?fi|internet/i, "wifi"],
  [/pool|swim/i, "pool"],
  [/tv|television|screen|desk|work|laptop|business/i, "screen"],
  [/bed|linen|bedding|mattress/i, "bed"],
  [/guest|person|occupan|capacity|seat|famil|group/i, "guests"],
  [/sq\.? ?ft|sqft|size|area|square/i, "size"],
  [/air ?condition|\bac\b|fridge|minibar|mini bar|cool/i, "cool"],
  [/dining|restaurant|menu|chef|food|meal|tea|coffee|pantry|breakfast|kitchen/i, "dining"],
  [/service|support|assist|laundry|turndown|towel|shower|bath|toiletries/i, "service"],
  [/\d\s*(am|pm)|hour|timing|morning|evening|schedule|all-?day|daily/i, "clock"],
  [/access|book|entry|guests only|in-?house|pre-?booked|priorit/i, "access"],
  [/event|wedding|shaadi|decor|light|stage|celebrat|conference|party/i, "event"],
];

export function iconKeyFor(label: string): keyof typeof PATHS {
  const match = KEYWORDS.find(([pattern]) => pattern.test(label));
  return match ? match[1] : "tick";
}

export function SpecIcon({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[iconKeyFor(label)]}
    </svg>
  );
}
