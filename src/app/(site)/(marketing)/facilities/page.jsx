import Link from "next/link";
import { facilities } from "./facility-data";
import { ImageCarousel } from "../components/ImageCarousel";

export const metadata = {
  title: "Facilities",
  description: "Explore all facilities including restaurant, lawn, pool, banquet, and event spaces.",
};

export default function FacilitiesPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">Facilities</p>
        <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl font-display">
          Facilities at <span className="font-forte">KiSHORi VATiKA</span>
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">
          View all property facilities with photos and detailed highlights.
        </p>
      </header>

      <div className="space-y-10">
        {facilities.map((facility) => (
          <section
            key={facility.slug}
            id={facility.slug}
            className="scroll-mt-24 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <ImageCarousel
              images={facility.images}
              title={facility.title}
              className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />

            <div className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-6">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                {facility.badge}
              </span>
              <h2 className="text-3xl font-semibold text-stone-900 font-display">{facility.title}</h2>
              <p className="text-sm text-stone-600 sm:text-base">{facility.longDescription}</p>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-stone-700">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Timing</p>
                  <p className="mt-1">{facility.timing}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Best for</p>
                  <p className="mt-1">{facility.bestFor}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Capacity</p>
                  <p className="mt-1">{facility.capacity}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Access</p>
                  <p className="mt-1">{facility.access}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Facility highlights</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  {facility.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Amenities</h3>
                <ul className="mt-2 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  {(facility.amenities ?? []).map((item) => (
                    <li key={item} className="rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/enquiry"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Enquire now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:border-emerald-300"
                >
                  Talk to team
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
