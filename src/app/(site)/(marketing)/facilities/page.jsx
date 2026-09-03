import Link from "next/link";
import { facilities } from "./facility-data";
import { FacilityCard } from "../components/FacilityCard";
import { attachFacilityImages } from "../lib/image-loader";
import { facilitiesPage, site } from "@/content/site-content";

export const runtime = "nodejs";

export const metadata = facilitiesPage.meta;

export default async function FacilitiesPage() {
  const withImages = await attachFacilityImages(facilities);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          {facilitiesPage.header.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          {facilitiesPage.header.title}{" "}
          <span className="font-forte">{site.name}</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          {facilitiesPage.header.description}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {withImages.map((facility) => (
          <FacilityCard key={facility.slug} facility={facility} />
        ))}
      </div>

      <section className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-normal tracking-tight text-emerald-950 sm:text-3xl">
          {facilitiesPage.callout.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-800">
          {facilitiesPage.callout.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={facilitiesPage.callout.primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
          >
            {facilitiesPage.callout.primaryCta.label}
          </Link>
          <Link
            href={facilitiesPage.callout.secondaryCta.href}
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            {facilitiesPage.callout.secondaryCta.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
