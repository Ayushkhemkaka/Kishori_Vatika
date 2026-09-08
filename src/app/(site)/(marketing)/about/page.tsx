import Link from "next/link";
import type { Metadata } from "next";
import { about, site } from "@/content/site-content";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = about.meta;

/**
 * Each block sits in its own hairline frame so the page reads as separate
 * cards rather than one continuous column of text, and every one of them
 * arrives on scroll with its neighbours staggered behind it.
 */
export default function AboutPage() {
  return (
    <div className="space-y-10">
      <Reveal>
        <header className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
          {about.header.eyebrow}
        </p>
        <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
          {about.header.title}
        </h1>
        <p className="text-base leading-relaxed text-stone-600">
          <span className="font-forte">{site.name}</span>{" "}
          {about.header.description}
          </p>
        </header>
      </Reveal>

      {/* Property facts, framed as their own strip. */}
      <Reveal>
        <dl className="grid gap-x-8 gap-y-4 rounded-md border border-emerald-100 bg-white p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {about.propertyHighlights.map((item) => (
            <div key={item} className="flex items-baseline gap-3">
              <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              <dd className="text-sm text-stone-700">{item}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <section className="grid gap-5 md:grid-cols-3">
        {about.values.map((item, index) => (
          <Reveal key={item.title} delay={index * 110}>
            <article className="kv-lift h-full space-y-2 rounded-md border border-emerald-100 bg-white p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10 sm:p-6">
              <h2 className="font-display text-xl font-medium text-stone-900">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-stone-600">
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Reveal className="h-full">
        <div className="h-full space-y-4 rounded-md border border-emerald-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-2xl font-normal text-stone-900 sm:text-3xl">
            {about.story.title}
          </h2>
          <p className="text-base leading-relaxed text-stone-600">
            {about.story.bodyBefore}{" "}
            <span className="font-forte">{site.name}</span>{" "}
            {about.story.bodyAfter}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={about.story.primaryCta.href}
              className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {about.story.primaryCta.label}
            </Link>
            <Link
              href={about.story.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-sm border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {about.story.secondaryCta.label}
            </Link>
          </div>
        </div>
        </Reveal>

        <Reveal delay={120} className="h-full">
        <aside className="h-full rounded-md border border-emerald-100 bg-emerald-50/50 p-5 sm:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {about.expectations.title}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
            {about.expectations.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
        </Reveal>
      </section>
    </div>
  );
}
