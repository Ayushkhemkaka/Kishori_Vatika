import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "A small boutique stay built for unhurried stays. Slow hospitality, locally rooted, thoughtful design.",
};

const values = [
  {
    title: "Slow hospitality",
    description:
      "We keep the pace gentle—no rush at breakfast, no rigid schedules. Your time here is yours to shape.",
  },
  {
    title: "Locally rooted",
    description:
      "From the coffee in your cup to the wood in the furniture, we lean on local makers and growers where we can.",
  },
  {
    title: "Thoughtful design",
    description:
      "Every room is designed for rest and small pleasures: good light, quiet corners, and a view that pulls you into the moment.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-200/90">
          About us
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl">
          A small place, built for unhurried stays.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          Kishori Villa started with a simple idea: a handful of rooms where
          guests could slow down, enjoy the hills, and leave feeling restored.
          We’re not a big resort—just a carefully run boutique stay with warm
          service and a view worth waking up for.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-3">
        {values.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/40 transition hover:border-amber-300/50"
          >
            <h2 className="text-base font-semibold text-amber-50">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-amber-50">
          What you can expect
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          A quiet property with a small team that knows your name. Breakfast
          with a view, an infinity deck for golden hour, and optional bonfire
          dinners and guided walks. We’re here to help you plan your days—or to
          leave you in peace if that’s what you need.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/offers"
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:bg-amber-300"
          >
            View our offers
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/60 hover:text-amber-100"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
