import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about KiSHORi VATiKA, our rooms, dining, and event spaces designed for elegant stays.",
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
      "One banquet, one small hall, and one lawn supported by a focused, experienced events team.",
  },
];

const propertyHighlights = [
  "5 room categories",
  "20 rooms total",
  "Restaurant and dining",
  "Swimming pool",
  "Banquet, small hall, and lawn",
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          About us
        </p>
        <h1 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          A resort built for refined stays.
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
          <span className="font-forte">KiSHORi VATiKA</span> is a thoughtfully designed hotel with elegant rooms,
          calm interiors, and warm hospitality. We focus on comfort, privacy,
          and the small details that make every stay feel effortless.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
          {propertyHighlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1"
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
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40 transition hover:border-emerald-200"
          >
            <h2 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8">
          <h2 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
            Our story
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            We created <span className="font-forte">KiSHORi VATiKA</span> to feel like a proper hotel stay with
            boutique charm. Whether you are here for a weekend escape, a family
            gathering, or a formal celebration, our spaces are designed to keep
            things simple, elegant, and comfortable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              View current offers
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8">
          <h2 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
            What to expect
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Concierge-led service for stays and events.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Restaurant dining with tailored menus on request.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              The only pool in the area. Dive in, cool down, let the afternoon disappear.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Event support for weddings, corporate stays, and celebrations.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
