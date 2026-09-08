import Link from "next/link";
import { PhotoCycle } from "./PhotoCycle";
import { SpecIcon } from "./SpecIcon";

export type CatalogueCardProps = {
  href: string;
  title: string;
  description: string;
  /** Up to six short specs; they wrap into a two- then three-column grid. */
  specs: string[];
  /** Short highlight chips under the specs, e.g. perks or event features. */
  tags?: string[];
  /** Small print above the headline figure, e.g. "Per night". */
  footerLabel: string;
  /** The figure itself: a rate, or the line a facility is best known for. */
  footerValue: string;
  ctaLabel: string;
  badge?: string;
  images?: string[];
  /** Puts the photo on the right, so a list of cards alternates sides. */
  flip?: boolean;
  /** Staggers the photo crossfade so neighbouring cards never change together. */
  index?: number;
};

/**
 * The wide catalogue row used by the rooms and facilities indexes: one photo
 * running the full height of the card, and a panel that reads top to bottom as
 * name, blurb, specs at a glance, the highlights, then the rate and the way
 * in. The four blocks keep one gap between them and sit centred against the
 * photo, so surplus height turns into even margin above and below the panel
 * rather than four gaps of four different sizes.
 *
 * Alternating the photo side down the page keeps a long list from reading as a
 * stack of identical blocks. Only the title and the Details button are links,
 * so the card is two clear targets rather than one with buttons buried in it.
 */
export function CatalogueCard({
  href,
  title,
  description,
  specs,
  tags = [],
  footerLabel,
  footerValue,
  ctaLabel,
  badge,
  images = [],
  flip = false,
  index = 0,
}: CatalogueCardProps) {
  return (
    <article className="kv-lift group grid overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10 lg:grid-cols-2">
      <div
        className={`relative h-[275px] w-full overflow-hidden bg-emerald-50 sm:h-[375px] lg:h-full lg:min-h-[450px] ${
          flip ? "lg:order-2" : ""
        }`}
      >
        <PhotoCycle
          images={images}
          alt={title}
          offsetMs={index * 900}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
        <div className="space-y-2">
          {badge ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-sm bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-3 w-3"
              >
                <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
                <circle cx="7.5" cy="7.5" r="1.2" />
              </svg>
              {badge}
            </span>
          ) : null}

          <h2 className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-3xl">
            <Link href={href} className="kv-underline transition-colors hover:text-emerald-700">
              {title}
            </Link>
          </h2>

          <p className="text-sm leading-relaxed text-stone-600">{description}</p>
        </div>

        {specs.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm text-stone-700 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec) => (
              <li key={spec} className="flex items-center gap-2">
                <SpecIcon label={spec} className="h-[18px] w-[18px] shrink-0 text-emerald-700" />
                <span className="truncate" title={spec}>
                  {spec}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 text-xs text-stone-600">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-sm border border-emerald-100 bg-emerald-50/60 px-3 py-1.5"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-emerald-100 pt-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {footerLabel}
            </p>
            <p className="mt-0.5 text-xl font-semibold text-stone-900">
              {footerValue}
            </p>
          </div>
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-emerald-600 py-2 pl-5 pr-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
          >
            {ctaLabel}
            <span className="kv-nudge flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-3.5 w-3.5"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
