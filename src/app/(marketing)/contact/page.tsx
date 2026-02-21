import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for bookings and enquiries. We respond within 24 hours.",
};

const contactItems = [
  {
    title: "Enquiries and bookings",
    description:
      "Share your dates, room preference, and event needs. Our team responds within 24 hours.",
    action: { label: "Send an enquiry", href: "/enquiry" },
  },
  {
    title: "Location",
    description:
      "Quiet hillside location, about 10 minutes from the city center. Address shared upon confirmation.",
    note: "Add your exact address and map link here before launch.",
  },
  {
    title: "Phone and WhatsApp",
    description:
      "Prefer to speak directly? Add your phone, WhatsApp, and email details here.",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
          Contact
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl font-display">
          We would love to plan your stay.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          For bookings and enquiries, the quickest way to reach us is through
          the enquiry form. We respond within 24 hours and can tailor rooms,
          dining, and event setups for your dates.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {contactItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-amber-200/15 bg-stone-950/60 p-5 shadow-lg shadow-black/30"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            {item.note && (
              <p className="mt-3 text-xs text-slate-500">{item.note}</p>
            )}
            {item.action && (
              <Link
                href={item.action.href}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md shadow-amber-500/30 transition hover:bg-amber-200"
              >
                {item.action.label}
              </Link>
            )}
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-amber-200/15 bg-gradient-to-br from-stone-950/80 via-stone-950 to-stone-900/80 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-amber-50 font-display">
            Planning an event?
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Our banquet and small hall are designed for weddings, corporate
            gatherings, and intimate celebrations. Tell us your guest count and
            preferred layout and we will share options quickly.
          </p>
          <Link
            href="/enquiry"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 shadow-md shadow-amber-500/30 transition hover:bg-amber-200"
          >
            Send an event enquiry
          </Link>
        </div>

        <aside className="rounded-2xl border border-emerald-300/20 bg-emerald-900/15 p-6 text-sm text-emerald-50">
          <h2 className="text-base font-semibold text-emerald-50">
            Quick response promise
          </h2>
          <p className="mt-2 text-emerald-100/80">
            We usually reply within 24 hours. Include your dates and we will
            confirm room availability and pricing.
          </p>
          <Link
            href="/enquiry"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300"
          >
            Send an enquiry
          </Link>
        </aside>
      </section>
    </div>
  );
}
