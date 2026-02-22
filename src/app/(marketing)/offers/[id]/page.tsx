import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { OfferClickLogger } from "./OfferClickLogger";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
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
    title: offer ? `${offer.title} - Kishori Vatika` : "Offer - Kishori Vatika",
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
        <h1 className="text-2xl font-semibold text-stone-900 font-display">
          Offer not found
        </h1>
        <p className="text-sm text-stone-600">
          This offer does not exist or is no longer active. Browse our current
          offers or send an enquiry and we will curate something for your dates.
        </p>
        <div className="flex gap-3">
          <Link
            href="/offers"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
          >
            Back to offers
          </Link>
          <Link
            href="/enquiry"
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 hover:border-emerald-300"
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
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
          Offer
        </p>
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl font-display">
          {offer.title}
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
          {offer.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-800">
          <span className="font-semibold">
            From {formatPrice(offer.price)} per night
          </span>
          <span className="text-xs text-stone-500">
            Valid {new Date(offer.validFrom).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })} - {new Date(offer.validTo).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40">
          <h2 className="text-sm font-semibold text-stone-900 font-display">
            What is included
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-stone-600">
            {includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 rounded-2xl border border-emerald-200/60 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-md shadow-emerald-100/40">
          <h2 className="text-sm font-semibold text-emerald-900">
            Ready to plan your stay?
          </h2>
          <p className="text-emerald-800">
            Share your dates, number of guests, and any special requests. Our
            team will get back to you with availability and pricing within 24
            hours.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
            >
              Enquire about this offer
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 hover:border-emerald-300"
            >
              View all offers
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
