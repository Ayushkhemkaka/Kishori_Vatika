import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { facilities } from "../facility-data";
import { ImageCarousel } from "../../components/ImageCarousel";
import { SpecIcon } from "../../components/SpecIcon";
import { Reveal } from "../../components/Reveal";
import { attachFacilityImages } from "../../lib/image-loader";
import { facilitiesPage } from "@/content/site-content";

export const runtime = "nodejs";

// The facility list is static, so every detail page can be built ahead of time.
export function generateStaticParams() {
  return facilities.map((facility) => ({ slug: facility.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = facilities.find((f) => f.slug === slug);
  if (!facility) return { title: "Facility" };
  return {
    title: facility.title,
    description: facility.longDescription ?? facility.description,
  };
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = facilities.find((f) => f.slug === slug);
  if (!facility) notFound();

  // Pull photos from public/facilities/<slug>/ so images can be added by
  // dropping files into the folder, with no code change.
  const [withImages] = await attachFacilityImages([facility]);
  const images = withImages.images ?? [];

  const others = facilities.filter((f) => f.slug !== slug);

  return (
    <div className="space-y-6">
      {/* The list is one step back, so a back link says it more plainly than
          a breadcrumb trail that would only repeat the title below it. */}
      <nav>
        <Link
          href="/facilities"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500 transition hover:text-emerald-700"
        >
          <span aria-hidden>&larr;</span>
          {facilitiesPage.detail.breadcrumb}
        </Link>
      </nav>

      {/* Photo first, sized to what is left of the viewport, so the whole
          frame is in view on landing with the detail below hinting at more.
          The name and the line about the place ride on the photo instead of
          stacking above it, which is what pushed the image off-screen. */}
      <header className="relative overflow-hidden rounded-lg border border-emerald-100">
        <ImageCarousel
          images={images}
          title={facility.title}
          containerClassName="h-[min(calc(100svh-12rem),640px)] min-h-[300px]"
          counterClassName="right-4 top-4"
          sizes="(min-width: 1024px) 90vw, 100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
          <h1 className="font-display text-3xl font-normal text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
            {facility.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            {facility.longDescription ?? facility.description}
          </p>
        </div>
      </header>

      {/* The specs run the full width as a strip of icon stats. Sitting them
          in the left column made that column much taller than the panel beside
          it, which is where the hole under the panel came from. */}
      <Reveal>
        <section className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-md border border-emerald-100 bg-emerald-50/60 p-5 sm:grid-cols-4 sm:p-6">
        {[
          [facilitiesPage.detail.specLabels.timing, facility.timing],
          [facilitiesPage.detail.specLabels.bestFor, facility.bestFor],
          [facilitiesPage.detail.specLabels.capacity, facility.capacity],
          [facilitiesPage.detail.specLabels.access, facility.access],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start gap-3">
            <SpecIcon label={`${label} ${value}`} className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {label}
              </p>
              <p className="mt-1 text-sm text-stone-700">{value}</p>
            </div>
          </div>
        ))}
        </section>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {facilitiesPage.detail.highlightsTitle}
            </h2>
            {/* Two columns of icon rows: a single column of four bullets left
                half the line empty and stretched the block down the page. */}
            <ul className="mt-3 grid gap-2.5 text-sm text-stone-700 sm:grid-cols-2">
              {facility.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <SpecIcon label={item} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-emerald-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {facilitiesPage.detail.amenitiesTitle}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
              {(facility.amenities ?? []).map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-sm border border-emerald-100 bg-emerald-50/60 px-3.5 py-1.5"
                >
                  <SpecIcon label={item} className="h-4 w-4 shrink-0 text-emerald-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit space-y-3 rounded-md border border-emerald-200/60 bg-emerald-50 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium text-emerald-900">
            {facilitiesPage.detail.asideTitle}
          </h2>
          <p className="text-sm leading-relaxed text-emerald-800">
            {facilitiesPage.detail.asideDescription}
          </p>
          <div className="flex flex-col gap-3 pt-1">
            <Link
              href={facilitiesPage.detail.primaryCta.href}
              className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {facilitiesPage.detail.primaryCta.label}
            </Link>
            <Link
              href={facilitiesPage.detail.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-sm border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {facilitiesPage.detail.secondaryCta.label}
            </Link>
          </div>
        </aside>
      </section>

      <Reveal>
        <section className="space-y-3 border-t border-emerald-100 pt-5">
        <h2 className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-3xl">
          {facilitiesPage.detail.otherTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/facilities/${other.slug}`}
              className="group rounded-md border border-emerald-100 bg-white p-4 transition hover:border-emerald-300"
            >
              <h3 className="font-display text-lg font-medium text-stone-900">
                {other.title}
              </h3>
              <p className="mt-1.5 text-sm text-stone-600">
                {other.description}
              </p>
              <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                {facilitiesPage.detail.viewLabel} &rarr;
              </span>
            </Link>
          ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
