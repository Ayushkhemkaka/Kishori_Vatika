import Link from "next/link";
import type { Metadata } from "next";
import { about, site } from "@/content/site-content";

export const metadata: Metadata = about.meta;

export default function AboutPage() {
  return (
    <div className="space-y-9">
      <header className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          {about.header.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          {about.header.title}
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
          <span className="font-forte">{site.name}</span>{" "}
          {about.header.description}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
          {about.propertyHighlights.map((item) => (
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
        {about.values.map((item) => (
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
            {about.story.title}
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            {about.story.bodyBefore}{" "}
            <span className="font-forte">{site.name}</span>{" "}
            {about.story.bodyAfter}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={about.story.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {about.story.primaryCta.label}
            </Link>
            <Link
              href={about.story.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {about.story.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8">
          <h2 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
            {about.expectations.title}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {about.expectations.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
