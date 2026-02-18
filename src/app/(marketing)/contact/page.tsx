import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for bookings and enquiries. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-200/90">
          Contact
        </p>
        <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl">
          We’d love to hear from you.
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          For bookings and enquiries, the best way to reach us is through the
          enquiry form—we’ll get back within 24 hours. For anything else, use
          the details below.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/90">
            Enquiries & bookings
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Share your dates and preferences and we’ll send availability and
            pricing.
          </p>
          <Link
            href="/enquiry"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:bg-amber-300"
          >
            Send an enquiry
          </Link>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/90">
            Location
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Quiet hillside, about 10 minutes from the city center. Exact address
            and directions sent after you book.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            [Placeholder: add real address and a small map or link when ready.]
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/40 sm:col-span-2 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/90">
            Other ways to reach us
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Phone and WhatsApp details can go here once you’re ready to publish
            them. For now, the enquiry form is the main channel.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-emerald-300/25 bg-emerald-900/20 p-5 text-sm text-emerald-50 sm:p-6">
        <h2 className="text-base font-semibold text-emerald-50">
          Prefer to talk through your stay?
        </h2>
        <p className="mt-1 text-emerald-100/80">
          Use the enquiry form and mention you’d like a call—we’ll arrange a
          time that works for you.
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
