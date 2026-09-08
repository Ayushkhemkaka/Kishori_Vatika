import Link from "next/link";
import type { Metadata } from "next";
import { dbClient as db } from "@/app/(shared)/lib/db-client";
import { offers as offersContent } from "@/content/site-content";
import { Reveal } from "../components/Reveal";

export const runtime = "nodejs";
export const revalidate = 300;

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}

export const metadata: Metadata = offersContent.meta;

export default async function OffersPage() {
  const now = new Date();
  const { data: offersData } = await db
    .from('"Offer"')
    .select("id,title,description,price,validFrom,validTo,isActive")
    .eq("isActive", true)
    .gte("validTo", now.toISOString())
    .order("validTo", { ascending: true });
  const offers = offersData ?? [];

  return (
    <div className="space-y-6">
      <Reveal>
        <header className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          {offersContent.header.eyebrow}
        </p>
        <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
          {offersContent.header.title}
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">
          These packages highlight the kinds of experiences we can create for
          your stay. Enquire to confirm availability and custom details for your
          dates.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
          {offersContent.categories.map((item) => (
            <span
              key={item}
              className="rounded-sm border border-emerald-200 bg-white px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
        </header>
      </Reveal>

      {offers.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2">
          {offers.map((offer, index) => (
            <Reveal key={offer.id} delay={index * 100} className="h-full">
            <article
              className="kv-lift group flex h-full flex-col justify-between rounded-md border border-emerald-100 bg-white p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-sm bg-amber-100 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-700">
                    Valid to{" "}
                    {new Date(offer.validTo).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-display text-xl font-medium tracking-tight text-stone-900">
                  {offer.title}
                </h2>
                <p className="line-clamp-3 text-sm text-stone-600">
                  {offer.description}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    From
                  </div>
                  <div className="text-sm font-semibold text-emerald-900">
                    {formatPrice(offer.price)}
                  </div>
                  <div className="text-xs text-stone-500">
                    per night - all inclusive
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
                  >
                    View offer
                  </Link>
                  <Link
                    href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-600"
                  >
                    {offersContent.enquireLabel} &rarr;
                  </Link>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </section>
      ) : (
        <div className="rounded-md border border-emerald-100 bg-white p-8 text-center">
          <p className="text-stone-600">
            {offersContent.empty.description}
          </p>
          <Link
            href="/enquiry"
            className="mt-4 inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
          >
            {offersContent.empty.cta.label}
          </Link>
        </div>
      )}

      <section className="rounded-md border border-emerald-200/60 bg-emerald-50 p-5 text-sm text-emerald-900 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-emerald-900">
          {offersContent.callout.title}
        </h2>
        <p className="mt-1 text-emerald-800">
          {offersContent.callout.description}
        </p>
        <Link
          href="/enquiry"
          className="mt-3 inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
        >
          Send an enquiry
        </Link>
      </section>
    </div>
  );
}

