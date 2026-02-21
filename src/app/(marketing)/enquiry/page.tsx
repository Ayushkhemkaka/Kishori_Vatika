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
        const details = data?.details?.fieldErrors as
          | Record<string, string[] | undefined>
          | undefined;
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
      <section className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
            Enquiry
          </p>
          <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl font-display">
            Tell us about your stay.
          </h1>
          <p className="max-w-xl text-sm text-stone-600 sm:text-base">
            Share your dates, number of guests, and any special occasion. We
            will respond with availability, pricing, and room suggestions that
            fit your needs.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Phone (optional)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder="Include country code if outside India"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Guests
              </label>
              <input
                required
                min={1}
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Check-in
              </label>
              <input
                required
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Check-out
              </label>
              <input
                required
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-stone-700">
              Interested in a specific offer?{" "}
              <span className="font-normal text-stone-500">
                (optional, pre-filled if you came from an offer page)
              </span>
            </label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              placeholder="Offer name or leave blank for general enquiry"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-stone-700">
              Anything you would like us to know?
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              placeholder="Share the purpose of your trip, dietary preferences, or room requests."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {formState === "submitting"
                ? "Sending your enquiry..."
                : formState === "submitted"
                  ? "Enquiry sent"
                  : "Send enquiry"}
            </button>
            <p className="text-xs text-stone-500">
              We usually respond within{" "}
              <span className="font-medium text-stone-700">24 hours</span>.
            </p>
          </div>

          {formState === "error" && errorMessage && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMessage}
            </p>
          )}

          {isSubmitted && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Thank you for reaching out. We have received your enquiry and will
              get back to you with availability and pricing within 24 hours.
            </p>
          )}
        </form>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm text-stone-700 shadow-md shadow-emerald-100/40">
          <h2 className="text-sm font-semibold text-stone-900 font-display">
            Helpful notes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>
                Children are welcome. Share ages and we will suggest the best
                room configuration.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>
                Dietary preferences can be accommodated with advance notice.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>
                Celebrations can include room decor, cake, or a private dinner.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-5 text-sm text-emerald-900">
          <h2 className="text-sm font-semibold text-emerald-900">
            Need a faster response?
          </h2>
          <p className="mt-2 text-emerald-800">
            Mention urgent timelines in your message and we will prioritize your
            request.
          </p>
          <p className="mt-3 text-xs text-emerald-700">
            Phone and WhatsApp details can be added here once ready to publish.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-stone-500">Loading enquiry form...</div>}
    >
      <EnquiryPageContent />
    </Suspense>
  );
}
