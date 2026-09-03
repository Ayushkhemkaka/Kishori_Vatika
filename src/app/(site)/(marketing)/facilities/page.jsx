import Link from "next/link";
import { facilities } from "./facility-data";
import { FacilityCard } from "../components/FacilityCard";
import { attachFacilityImages } from "../lib/image-loader";

export const runtime = "nodejs";

export const metadata = {
  title: "Facilities",
  description:
    "Explore all facilities including restaurant, lawn, pool, banquet, and event spaces.",
};

export default async function FacilitiesPage() {
  const withImages = await attachFacilityImages(facilities);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          Facilities
        </p>
        <h1 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          Facilities at <span className="font-forte">KiSHORi VATiKA</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          Everything the property offers, from all-day dining to open lawns
          built for celebration. Open any facility for photos and details.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {withImages.map((facility) => (
          <FacilityCard key={facility.slug} facility={facility} />
        ))}
      </div>

      <section className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-normal tracking-tight text-emerald-950 sm:text-3xl">
          Planning a celebration?
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-800">
          Share your dates and guest count and our team will suggest the right
          space, layout, and catering for the occasion.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/enquiry"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
          >
            Enquire now
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Talk to team
          </Link>
        </div>
      </section>
    </div>
  );
}
