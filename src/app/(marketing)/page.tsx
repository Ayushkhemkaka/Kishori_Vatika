import Link from "next/link";
import { prisma } from "@/lib/db";

const roomHighlights = [
  {
    title: "Lakeview Suite",
    description:
      "Expansive views, king bed, private balcony, artisanal breakfast.",
    badge: "Most popular",
  },
  {
    title: "Garden Courtyard Rooms",
    description:
      "Sunlit rooms opening into a lush, candle-lit courtyard.",
    badge: "Perfect for couples",
  },
  {
    title: "Family Loft",
    description:
      "Two-level loft with reading nook and kid-friendly amenities.",
    badge: "Great for families",
  },
];

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `₹${n.toLocaleString("en-IN")}`;
}

export default async function MarketingHomePage() {
  const now = new Date();
  const activeOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validTo: { gte: now },
    },
    orderBy: { validTo: "asc" },
    take: 6,
  });

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-amber-200">
            Boutique escape
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            Open for bookings
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-amber-50 sm:text-5xl lg:text-6xl">
            Slow down at{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-rose-200 bg-clip-text text-transparent">
              Kishori Villa
            </span>
            .
          </h1>
          <p className="max-w-xl text-balance text-base text-slate-200/80 sm:text-lg">
            A handful of thoughtfully designed rooms, warm hospitality, and a
            view that invites you to linger. Wake up to birdsong, locally
            roasted coffee, and the sound of distant river currents.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 transition hover:bg-amber-300"
            >
              Check availability
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/40 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/60 hover:text-amber-100"
            >
              View current offers
            </Link>
          </div>
          <dl className="mt-4 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Check-in / Check-out
              </dt>
              <dd>2:00 pm · 11:00 am</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Location
              </dt>
              <dd>Quiet hillside, 10 mins from city center</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Highlights
              </dt>
              <dd>Infinity deck · Bonfire dinners · Curated trails</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-40 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-black/60">
            <div className="h-64 bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.25),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(52,211,153,0.18),transparent_55%)]" />
            <div className="space-y-3 border-t border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
                Tonight at Kishori Villa
              </p>
              <p className="text-sm text-slate-200">
                Golden hour on the deck, soft jazz, and a chef&apos;s tasting
                menu inspired by local produce.
              </p>
              <p className="text-xs text-slate-400">
                &quot;The kind of stay that makes you forget your inbox exists.&quot; —
                recent guest
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-amber-50 sm:text-2xl">
              Rooms & Suites
            </h2>
            <p className="text-sm text-slate-300">
              A small collection of rooms, each with its own mood and view.
            </p>
          </div>
          <Link
            href="/offers"
            className="hidden text-sm font-medium text-amber-200 hover:text-amber-100 sm:inline-flex"
          >
            Explore current offers →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {roomHighlights.map((room) => (
            <article
              key={room.title}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-lg shadow-black/40 transition hover:border-amber-300/60 hover:bg-slate-900/80"
            >
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-amber-400/10 px-2 py-1 text-[11px] font-medium text-amber-200">
                  {room.badge}
                </span>
                <h3 className="text-base font-semibold text-amber-50">
                  {room.title}
                </h3>
                <p className="text-sm text-slate-300">{room.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Complimentary breakfast · High-speed Wi‑Fi</span>
                <span className="text-amber-200/80 group-hover:text-amber-100">
                  View details
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-900/40 via-slate-950 to-emerald-950/60 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-emerald-50 sm:text-2xl">
              Current offers
            </h2>
            <p className="text-sm text-emerald-100/80">
              Curated stays with little extras built in—perfect for your next
              escape.
            </p>
          </div>
          <Link
            href="/offers"
            className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
          >
            See all offers
          </Link>
        </div>
        {activeOffers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeOffers.map((offer) => (
              <article
                key={offer.id}
                className="group flex flex-col justify-between rounded-2xl border border-emerald-200/25 bg-slate-950/60 p-4 transition hover:border-emerald-200/80 hover:bg-slate-950"
              >
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-emerald-400/15 px-2 py-1 text-[11px] font-medium text-emerald-200">
                    Limited time
                  </span>
                  <h3 className="text-base font-semibold text-emerald-50">
                    {offer.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-emerald-50/80">
                    {offer.description}
                  </p>
                </div>
                <div className="mt-3 flex justify-between text-xs text-emerald-100/80">
                  <span>
                    From {formatPrice(offer.price)} · Breakfast, Wi‑Fi, and taxes
                    included.
                  </span>
                  <Link
                    href={`/offers/${offer.id}`}
                    className="font-medium text-emerald-200 hover:text-emerald-50"
                  >
                    View →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-emerald-200/25 bg-slate-950/60 p-5 text-sm text-emerald-100/80">
            No active offers at the moment. Check back soon or{" "}
            <Link href="/enquiry" className="font-medium text-emerald-200 hover:text-emerald-50">
              send an enquiry
            </Link>{" "}
            and we&apos;ll tailor something for your dates.
          </p>
        )}
      </section>
    </div>
  );
}
