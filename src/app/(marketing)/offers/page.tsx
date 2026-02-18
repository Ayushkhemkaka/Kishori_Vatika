import Link from "next/link";
import { prisma } from "@/lib/db";

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `₹${n.toLocaleString("en-IN")}`;
}

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
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-200/90">
          Offers
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl">
          Thoughtfully crafted stays, with little extras built in.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          These offers give you a feel for what we can put together for your
          visit. When you send an enquiry, we&apos;ll confirm availability and
          tailor the details to your dates and preferences.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 text-xs text-slate-300">
        <span className="rounded-full border border-slate-600/70 bg-slate-950/50 px-3 py-1">
          Weekend getaways
        </span>
        <span className="rounded-full border border-slate-600/70 bg-slate-950/50 px-3 py-1">
          Work-from-hills
        </span>
        <span className="rounded-full border border-slate-600/70 bg-slate-950/50 px-3 py-1">
          Special occasions
        </span>
      </div>

      {offers.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/40 transition hover:border-amber-300/70 hover:bg-slate-950"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-amber-400/10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200">
                    Valid to{" "}
                    {new Date(offer.validTo).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-amber-50">
                  {offer.title}
                </h2>
                <p className="line-clamp-3 text-sm text-slate-200">
                  {offer.description}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    From
                  </div>
                  <div className="text-sm font-semibold text-amber-100">
                    {formatPrice(offer.price)}
                  </div>
                  <div className="text-xs text-slate-400">
                    per night · all inclusive
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:bg-amber-300"
                  >
                    View offer
                  </Link>
                  <Link
                    href={`/enquiry?offer=${encodeURIComponent(offer.id)}`}
                    className="text-xs font-medium text-amber-200 hover:text-amber-100"
                  >
                    Enquire about this →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center">
          <p className="text-slate-300">
            No active offers at the moment. We&apos;re updating our packages—check
            back soon or send an enquiry and we&apos;ll tailor something for your
            dates.
          </p>
          <Link
            href="/enquiry"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:bg-amber-300"
          >
            Send an enquiry
          </Link>
        </div>
      )}

      <section className="rounded-2xl border border-emerald-400/25 bg-emerald-900/20 p-5 text-sm text-emerald-50 sm:p-6">
        <h2 className="text-base font-semibold text-emerald-50">
          Looking for something specific?
        </h2>
        <p className="mt-1 text-emerald-100/80">
          Tell us your dates, number of guests, and the kind of experience
          you&apos;re after—quiet work week, anniversary celebration, or a
          family break—and we&apos;ll respond with tailored options.
        </p>
        <Link
          href="/enquiry"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300"
        >
          Send an enquiry
        </Link>
      </section>
    </div>
  );
}
