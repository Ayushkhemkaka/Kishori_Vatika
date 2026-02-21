import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Kishori Villa, our rooms, dining, and event spaces designed for elegant stays.",
};

const values = [
  {
    title: "Warm hospitality",
    description:
      "A small team, attentive service, and a calm pace that lets you settle in quickly.",
  },
  {
    title: "Boutique comfort",
    description:
      "Twenty rooms across five categories, with thoughtful layouts and restful interiors.",
  },
  {
    title: "Celebrations made easy",
    description:
      "One banquet and one small hall supported by a focused, experienced events team.",
  },
];

const propertyHighlights = [
  "5 room categories",
  "20 rooms total",
  "Restaurant and dining",
  "Swimming pool",
  "Banquet and small hall",
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
          About us
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl font-display">
          A boutique hotel built for refined stays.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          Kishori Villa is a thoughtfully designed hotel with elegant rooms,
          calm interiors, and warm hospitality. We focus on comfort, privacy,
          and the small details that make every stay feel effortless.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-amber-100">
          {propertyHighlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-amber-200/20 bg-stone-950/60 px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {values.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-amber-200/15 bg-stone-950/60 p-5 shadow-lg shadow-black/30 transition hover:border-amber-200/40"
          >
            <h2 className="text-base font-semibold text-amber-50 font-display">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-amber-200/15 bg-gradient-to-br from-stone-950/80 via-stone-950 to-stone-900/80 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-amber-50 font-display">
            Our story
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            We created Kishori Villa to feel like a proper hotel stay with
            boutique charm. Whether you are here for a weekend escape, a family
            gathering, or a formal celebration, our spaces are designed to keep
            things simple, elegant, and comfortable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 shadow-md shadow-amber-500/30 transition hover:bg-amber-200"
            >
              View current offers
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-amber-200/30 bg-stone-950/60 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-200/60 hover:text-amber-50"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/15 bg-stone-950/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-amber-50 font-display">
            What to expect
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
              Concierge-led service for stays and events.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
              Restaurant dining with tailored menus on request.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
              A calm pool deck and lounges for quiet downtime.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
              Event support for weddings, corporate stays, and celebrations.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
