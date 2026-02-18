import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { OfferClickLogger } from "./OfferClickLogger";

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `Rs ${n.toLocaleString("en-IN")}`;
}

const getOfferById = cache(async (id: string) =>
  prisma.offer.findUnique({
    where: { id },
    include: { features: true },
  })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOfferById(id);
  return {
    title: offer ? `${offer.title} · Kishori Villa` : "Offer · Kishori Villa",
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer || !offer.isActive) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-amber-50">Offer not found</h1>
        <p className="text-sm text-slate-300">
          This offer doesn&apos;t exist or is no longer active. Browse our current
          offers or send us an enquiry and we&apos;ll curate something for your
          dates.
        </p>
        <div className="flex gap-3">
          <Link
            href="/offers"
            className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:bg-amber-300"
          >
            Back to offers
          </Link>
          <Link
            href="/enquiry"
            className="rounded-full border border-slate-600/70 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-amber-100 hover:border-amber-300/60"
          >
            Send an enquiry
          </Link>
        </div>
      </div>
    );
  }

  const includes =
    offer.features.length > 0
      ? offer.features.map((f) => (f.value ? `${f.label}: ${f.value}` : f.label))
      : [offer.description];

  return (
    <div className="space-y-8">
      <OfferClickLogger offerId={offer.id} />
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-200/90">
          Offer
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl">
          {offer.title}
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          {offer.description}
        </p>
        <p className="text-sm font-semibold text-amber-100">
          From {formatPrice(offer.price)} per night
        </p>
        <p className="text-xs text-slate-400">
          Valid{" "}
          {new Date(offer.validFrom).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(offer.validTo).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/40">
          <h2 className="text-sm font-semibold text-amber-50">
            What&apos;s included
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 rounded-2xl border border-emerald-300/30 bg-emerald-900/10 p-5 text-sm text-emerald-50 shadow-lg shadow-emerald-500/20">
          <h2 className="text-sm font-semibold text-emerald-50">
            Ready to plan your stay?
          </h2>
          <p className="text-emerald-100/85">
            Share your dates, number of guests, and any special occasions-our
            team will get back to you with availability and pricing within 24
            hours.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300"
            >
              Enquire about this offer
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200/60 bg-transparent px-4 py-2 text-xs font-semibold text-emerald-100 hover:border-emerald-100"
            >
              View all offers
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
