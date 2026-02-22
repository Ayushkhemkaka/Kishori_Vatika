import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Curated stay packages with dining, experiences, and event options at Kishori Vatika.",
};

const offerCategories = [
  "Weekend getaways",
  "Business stays",
  "Celebrations",
  "Family escapes",
];

export default async function OffersPage() {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      validTo: { gte: now },
    },
    orderBy: { validTo: "asc" },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
          Offers
        </p>
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl lg:text-4xl font-display">
          Curated stays with thoughtful extras.
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
          These packages highlight the kinds of experiences we can create for
          your stay. Enquire to confirm availability and custom details for your
          dates.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
          {offerCategories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </header>

      {offers.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40 transition hover:border-emerald-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-700">
                    Valid to{" "}
                    {new Date(offer.validTo).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-stone-900 font-display">
                  {offer.title}
                </h2>
                <p className="line-clamp-3 text-sm text-stone-600">
                  {offer.description}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
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
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
                  >
                    View offer
                  </Link>
                  <Link
                    href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-600"
                  >
                    Enquire about this &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center">
          <p className="text-stone-600">
            No active offers at the moment. We are updating packages - check
            back soon or send an enquiry and we will tailor something for your
            dates.
          </p>
          <Link
            href="/enquiry"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
          >
            Send an enquiry
          </Link>
        </div>
      )}

      <section className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-5 text-sm text-emerald-900 sm:p-6">
        <h2 className="text-base font-semibold text-emerald-900">
          Looking for something specific?
        </h2>
        <p className="mt-1 text-emerald-800">
          Tell us your dates, number of guests, and the kind of experience you
          are after - quiet work week, anniversary celebration, or a family
          break - and we will respond with tailored options.
        </p>
        <Link
          href="/enquiry"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
        >
          Send an enquiry
        </Link>
      </section>
    </div>
  );
}
