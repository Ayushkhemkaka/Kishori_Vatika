"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type FormState = "idle" | "submitting" | "submitted" | "error";

function EnquiryPageContent() {
  const searchParams = useSearchParams();
  const preselectedOfferId = searchParams.get("offer") ?? "";
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [offer, setOffer] = useState(preselectedOfferId);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const body: Record<string, unknown> = {
        name,
        email,
        phone: phone || undefined,
        message,
        checkIn,
        checkOut,
        guests: parseInt(guests, 10) || 2,
      };
      const looksLikeCuid = /^c[a-z0-9]{24}$/i.test(offer);
      if (offer) {
        if (looksLikeCuid) body.offerId = offer;
        else body.offerSlug = offer;
      }

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormState("error");
        const details = data?.details?.fieldErrors as Record<string, string[] | undefined> | undefined;
        const msg = details
          ? Object.entries(details)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
              .join("; ")
          : data?.error ?? "Something went wrong. Please try again.";
        setErrorMessage(msg);
        return;
      }

      setFormState("submitted");
    } catch {
      setFormState("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  const isSubmitted = formState === "submitted";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      <section className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-200/90">
            Enquiry
          </p>
          <h1 className="text-2xl font-semibold text-amber-50 sm:text-3xl">
            Tell us about your stay.
          </h1>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            Share your dates, number of guests, and any special occasion.
            We&apos;ll get back to you with availability, pricing, and a couple
            of suggestions that fit.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/40"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Phone (optional)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
                placeholder="With country code if outside India"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Guests
              </label>
              <input
                required
                min={1}
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Check-in
              </label>
              <input
                required
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Check-out
              </label>
              <input
                required
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200">
              Interested in a specific offer?{" "}
              <span className="font-normal text-slate-400">
                (optional—pre-filled if you came from an offer page)
              </span>
            </label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
              placeholder="Offer name or leave blank for general enquiry"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200">
              Anything you&apos;d like us to know?
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-amber-300 focus:bg-slate-900 focus:outline-none"
              placeholder="Share the purpose of your trip, any dietary preferences, or room preferences."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-300/60"
            >
              {formState === "submitting"
                ? "Sending your enquiry..."
                : formState === "submitted"
                  ? "Enquiry sent"
                  : "Send enquiry"}
            </button>
            <p className="text-xs text-slate-400">
              We usually respond within{" "}
              <span className="font-medium text-slate-200">24 hours</span>.
            </p>
          </div>

          {formState === "error" && errorMessage && (
            <p className="rounded-lg border border-rose-400/40 bg-rose-900/20 px-3 py-2 text-xs text-rose-50">
              {errorMessage}
            </p>
          )}

          {isSubmitted && (
            <p className="rounded-lg border border-emerald-400/40 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-50">
              Thank you for reaching out. We&apos;ve received your enquiry and will
              get back to you with availability and pricing within 24 hours.
            </p>
          )}
        </form>
      </section>

      <aside className="space-y-4 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-5 text-sm text-slate-200">
        <h2 className="text-sm font-semibold text-amber-50">
          A few helpful notes
        </h2>
        <ul className="space-y-2 text-sm text-slate-200">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>
              Children are welcome; let us know their ages and we&apos;ll suggest
              the most comfortable room configuration.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>
              We can accommodate certain dietary preferences with advance
              notice—share details in your message.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>
              Celebrating something? We&apos;d love to help—room decor, cake, or a
              special dinner can be arranged.
            </span>
          </li>
        </ul>
        <p className="pt-1 text-xs text-slate-400">
          You can also reach out by phone or WhatsApp if you prefer.
        </p>
      </aside>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-400">Loading enquiry form...</div>}>
      <EnquiryPageContent />
    </Suspense>
  );
}
