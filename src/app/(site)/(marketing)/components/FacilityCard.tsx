import Link from "next/link";
import { PhotoCycle } from "./PhotoCycle";

export type FacilityCardData = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  /** Populated by attachFacilityImages() from public/facilities/<slug>/. */
  images?: string[];
  /** Overrides the default /facilities/<slug> destination. */
  href?: string;
};

/**
 * Facility box used on the home page and the facilities index. Shared so the
 * two stay in step; the whole card is the link target.
 */
export function FacilityCard({
  facility,
  /** Passed by the grid so neighbouring cards do not change photo together. */
  index = 0,
}: {
  facility: FacilityCardData;
  index?: number;
}) {
  const href = facility.href ?? `/facilities/${facility.slug}`;
  const photos = facility.images ?? [];

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white transition hover:border-emerald-300"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50">
        {photos.length > 0 ? (
          <PhotoCycle
            images={photos}
            alt={facility.title}
            offsetMs={index * 900}
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          // No photos in the folder yet - keep the card's shape rather than
          // collapsing the layout.
          <div className="flex h-full items-center justify-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700/60">
              Photos coming soon
            </span>
          </div>
        )}

        {facility.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800 backdrop-blur">
            {facility.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
          {facility.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
          {facility.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Explore
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
