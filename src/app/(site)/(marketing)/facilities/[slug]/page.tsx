import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { facilities } from "../facility-data";
import { ImageCarousel } from "../../components/ImageCarousel";
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
    <div className="space-y-10">
      <nav className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500">
        <Link href="/facilities" className="transition hover:text-emerald-700">
          {facilitiesPage.detail.breadcrumb}
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="text-emerald-700">{facility.title}</span>
      </nav>

      <header className="space-y-4">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-700">
          {facility.badge}
        </span>
        <h1 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          {facility.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          {facility.longDescription ?? facility.description}
        </p>
      </header>

      <ImageCarousel
        images={images}
        title={facility.title}
        containerClassName="h-[300px] rounded-3xl border border-emerald-100 sm:h-[440px] lg:h-[560px]"
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-stone-700 sm:grid-cols-4">
            {[
              [facilitiesPage.detail.specLabels.timing, facility.timing],
              [facilitiesPage.detail.specLabels.bestFor, facility.bestFor],
              [facilitiesPage.detail.specLabels.capacity, facility.capacity],
              [facilitiesPage.detail.specLabels.access, facility.access],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-700">
                  {label}
                </p>
                <p className="mt-1.5">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {facilitiesPage.detail.highlightsTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {facility.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
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
                  className="rounded-full border border-emerald-100 bg-emerald-50/60 px-3.5 py-1.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-emerald-200/60 bg-emerald-50 p-6">
          <h2 className="font-sans text-lg font-medium text-emerald-900">
            {facilitiesPage.detail.asideTitle}
          </h2>
          <p className="text-sm leading-relaxed text-emerald-800">
            {facilitiesPage.detail.asideDescription}
          </p>
          <div className="flex flex-col gap-3 pt-1">
            <Link
              href={facilitiesPage.detail.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {facilitiesPage.detail.primaryCta.label}
            </Link>
            <Link
              href={facilitiesPage.detail.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {facilitiesPage.detail.secondaryCta.label}
            </Link>
          </div>
        </aside>
      </section>

      <section className="space-y-5 border-t border-emerald-100 pt-8">
        <h2 className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-3xl">
          {facilitiesPage.detail.otherTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/facilities/${other.slug}`}
              className="group rounded-2xl border border-emerald-100 bg-white p-4 transition hover:border-emerald-300"
            >
              <h3 className="font-sans text-base font-medium text-stone-900">
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
    </div>
  );
}
