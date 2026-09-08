import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "./components/ContactForm";
import { LocationMap } from "../components/LocationMap";
import { Reveal } from "../components/Reveal";
import { contact, home } from "@/content/site-content";

export const metadata: Metadata = contact.meta;

/**
 * One ask, not four: the channels carry text links and the form is the only
 * filled button on the page. Each block keeps its own hairline frame so the
 * page reads as cards rather than one continuous column, and every block
 * arrives on scroll behind the one above it.
 */
export default function ContactPage() {
  return (
    <div className="space-y-10">
      <Reveal>
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
            {contact.header.eyebrow}
          </p>
          <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
            {contact.header.title}
          </h1>
          <p className="text-base leading-relaxed text-stone-600">
            {contact.header.description}
          </p>
        </header>
      </Reveal>

      {/* How to reach us: three ways, each in its own frame. The actions stay
          text links - three filled buttons in a row was most of the noise. */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {contact.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 110} className="h-full">
            <article className="kv-lift flex h-full flex-col gap-2 rounded-md border border-emerald-100 bg-white p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10 sm:p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-stone-700">
                {item.description}
              </p>
              {item.note ? (
                <p className="text-xs text-stone-500">{item.note}</p>
              ) : null}
              {item.action ? (
                <Link
                  href={item.action.href}
                  className="group mt-auto inline-flex items-center gap-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:text-emerald-600"
                >
                  <span className="kv-underline">{item.action.label}</span>
                  <span className="kv-nudge">&rarr;</span>
                </Link>
              ) : null}
            </article>
          </Reveal>
        ))}
      </section>

      {/* The form and the map sit side by side: a visitor deciding how to
          reach us wants the message box and the way here in one glance. The
          map carries its own directions link. */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="h-full space-y-4 rounded-md border border-emerald-100 bg-white p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-normal text-stone-900 sm:text-3xl">
                {contact.messageBlock.title}
              </h2>
              <p className="text-sm leading-relaxed text-stone-600">
                {contact.messageBlock.description} We usually reply within 24
                hours - include your dates and we will confirm room availability
                and pricing.
              </p>
            </div>
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={130} className="h-full">
          <div className="kv-themed-section flex h-full flex-col gap-3 rounded-md border border-emerald-100 bg-white p-5 sm:p-6">
            <h2 className="font-display text-2xl font-normal text-stone-900 sm:text-3xl">
              {home.locationSection.title}
            </h2>
            <LocationMap />
            <p className="text-sm leading-relaxed text-stone-600">
              {home.locationSection.description}
            </p>
          </div>
        </Reveal>
      </section>

      {/* What to include, and the one ask that is not a room enquiry. */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="h-full rounded-md border border-emerald-100 bg-emerald-50/50 p-5 sm:p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {contact.checklist.title}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
              {contact.checklist.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={130} className="h-full">
          <div className="kv-lift h-full rounded-md border border-emerald-100 bg-white p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/10 sm:p-6">
            <h2 className="font-display text-xl font-medium text-stone-900">
              Planning an event?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Our banquet, small hall, and lawn suit weddings, corporate
              gatherings, and intimate celebrations. Send your guest count and
              preferred layout and we will share options quickly.
            </p>
            <Link
              href="/enquiry"
              className="group mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:text-emerald-600"
            >
              <span className="kv-underline">Send an event enquiry</span>
              <span className="kv-nudge">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
