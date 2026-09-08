import Link from "next/link";
import { facilities } from "./facility-data";
import { CatalogueCard } from "../components/CatalogueCard";
import { Reveal } from "../components/Reveal";
import { attachFacilityImages } from "../lib/image-loader";
import { facilitiesPage, site } from "@/content/site-content";

export const runtime = "nodejs";

export const metadata = facilitiesPage.meta;

export default async function FacilitiesPage() {
  const withImages = await attachFacilityImages(facilities);

  return (
    <div className="space-y-6">
      <Reveal>
        <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          {facilitiesPage.header.eyebrow}
        </p>
        <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
          {facilitiesPage.header.title}{" "}
          <span className="font-forte">{site.name}</span>
        </h1>
        <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
          {facilitiesPage.header.description}
        </p>
        </header>
      </Reveal>

      <div className="space-y-6">
        {withImages.map((facility, index) => (
          <Reveal key={facility.slug} delay={index * 90} className="scroll-mt-24">
            <CatalogueCard
              href={`/facilities/${facility.slug}`}
              title={facility.title}
              description={facility.longDescription ?? facility.description}
              badge={facility.badge}
              images={facility.images}
              // A facility has no rate, so its row leads with when it is open
              // and how big it is, then borrows the rest from the amenities.
              specs={[facility.timing, facility.capacity, facility.access, ...(facility.amenities ?? []).slice(0, 3)].filter(Boolean)}
              tags={(facility.highlights ?? []).slice(0, 4)}
              footerLabel={facilitiesPage.list.footerLabel}
              footerValue={facility.bestFor}
              ctaLabel={facilitiesPage.list.ctaLabel}
              flip={index % 2 === 1}
              index={index}
            />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="rounded-md border border-emerald-200/60 bg-emerald-50 p-5 sm:p-7">
        <h2 className="font-display text-2xl font-normal tracking-tight text-emerald-950 sm:text-3xl">
          {facilitiesPage.callout.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-800">
          {facilitiesPage.callout.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={facilitiesPage.callout.primaryCta.href}
            className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
          >
            {facilitiesPage.callout.primaryCta.label}
          </Link>
          <Link
            href={facilitiesPage.callout.secondaryCta.href}
            className="inline-flex items-center justify-center rounded-sm border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            {facilitiesPage.callout.secondaryCta.label}
          </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
