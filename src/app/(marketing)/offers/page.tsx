import Link from "next/link";
import { prisma } from "@/lib/db";

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}

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
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
          Offers
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl font-display">
          Curated stays with thoughtful extras.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          These packages highlight the kinds of experiences we can create for
          your stay. Enquire to confirm availability and custom details for your
          dates.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-amber-100">
          {offerCategories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-amber-200/20 bg-stone-950/60 px-3 py-1"
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
              className="group flex flex-col justify-between rounded-2xl border border-amber-200/15 bg-stone-950/60 p-5 shadow-lg shadow-black/30 transition hover:border-amber-200/45 hover:bg-stone-950"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-amber-200/10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200/80">
                    Valid to{" "}
                    {new Date(offer.validTo).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-amber-50 font-display">
                  {offer.title}
                </h2>
                <p className="line-clamp-3 text-sm text-slate-200">
                  {offer.description}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    From
                  </div>
                  <div className="text-sm font-semibold text-amber-100">
                    {formatPrice(offer.price)}
                  </div>
                  <div className="text-xs text-slate-500">
                    per night - all inclusive
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md shadow-amber-500/30 transition hover:bg-amber-200"
                  >
                    View offer
                  </Link>
                  <Link
                    href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
                    className="text-xs font-medium text-amber-200 hover:text-amber-100"
                  >
                    Enquire about this ->
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-amber-200/15 bg-stone-950/60 p-8 text-center">
          <p className="text-slate-300">
            No active offers at the moment. We are updating packages - check
            back soon or send an enquiry and we will tailor something for your
            dates.
          </p>
          <Link
            href="/enquiry"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-stone-950 shadow-md shadow-amber-500/30 transition hover:bg-amber-200"
          >
            Send an enquiry
          </Link>
        </div>
      )}

      <section className="rounded-2xl border border-emerald-300/20 bg-emerald-900/15 p-5 text-sm text-emerald-50 sm:p-6">
        <h2 className="text-base font-semibold text-emerald-50">
          Looking for something specific?
        </h2>
        <p className="mt-1 text-emerald-100/80">
          Tell us your dates, number of guests, and the kind of experience you
          are after - quiet work week, anniversary celebration, or a family
          break - and we will respond with tailored options.
        </p>
        <Link
          href="/enquiry"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300"
        >
          Send an enquiry
        </Link>
      </section>
    </div>
  );
}
