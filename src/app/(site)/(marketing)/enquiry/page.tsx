"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { contact, enquiry } from "@/content/site-content";
import { Reveal } from "../components/Reveal";

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

      const data = await res.json();

      if (!res.ok) {
        setFormState("error");
        const details = data?.details?.fieldErrors as
          | Record<string, string[] | undefined>
          | undefined;
        const msg = details
          ? Object.entries(details)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
              .join("; ")
          : data?.error ?? enquiry.genericError;
        setErrorMessage(msg);
        return;
      }

      setFormState("submitted");
    } catch {
      setFormState("error");
      setErrorMessage(enquiry.networkError);
    }
  }

  const isSubmitted = formState === "submitted";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
      <section className="space-y-5">
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
            {enquiry.header.eyebrow}
          </p>
          <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
            {enquiry.header.title}
          </h1>
          <p className="max-w-xl text-sm text-stone-600 sm:text-base">
            {enquiry.header.description}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-md border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                {enquiry.fields.name.label}
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder={enquiry.fields.name.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                {enquiry.fields.email.label}
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder={enquiry.fields.email.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                {enquiry.fields.phone.label}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
                placeholder={enquiry.fields.phone.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                {enquiry.fields.guests.label}
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
                {enquiry.fields.checkIn.label}
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
                {enquiry.fields.checkOut.label}
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
              {enquiry.fields.offer.label}{" "}
              <span className="font-normal text-stone-500">
                {enquiry.fields.offer.hint}
              </span>
            </label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              placeholder={enquiry.fields.offer.placeholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-stone-700">
              {enquiry.fields.message.label}
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
              placeholder={enquiry.fields.message.placeholder}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex w-full items-center justify-center rounded-sm bg-emerald-600 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
            >
              {formState === "submitting"
                ? "Sending your enquiry..."
                : formState === "submitted"
                  ? "Enquiry sent"
                  : "Send enquiry"}
            </button>
            <p className="text-xs text-stone-500">
              {enquiry.responseNote.before}{" "}
              <span className="font-medium text-stone-700">
                {enquiry.responseNote.value}
              </span>
              .
            </p>
          </div>

          {formState === "error" && errorMessage && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMessage}
            </p>
          )}

          {isSubmitted && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {enquiry.success}
            </p>
          )}
        </form>
      </section>

      <aside className="space-y-5">
        <div className="rounded-md border border-emerald-100 bg-white p-5 text-sm text-stone-700 shadow-md shadow-emerald-100/40">
          <h2 className="font-display text-xl font-medium tracking-tight text-stone-900">
            {enquiry.notes.title}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            {enquiry.notes.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-emerald-200/60 bg-emerald-50 p-5 text-sm text-emerald-900">
          <h2 className="font-display text-base font-semibold text-emerald-900">
            {enquiry.fasterResponse.title}
          </h2>
          <p className="mt-2 text-emerald-800">
            {enquiry.fasterResponse.description}
          </p>
          <p className="mt-3 text-xs text-emerald-700">
            {enquiry.fasterResponse.note}
          </p>
        </div>

        {/* The form is tall; without a third block this column ran out of
            content halfway down it. These are the ways to reach us that do
            not involve the form, which is the right thing to offer beside
            one. */}
        <div className="rounded-md border border-emerald-100 bg-white p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {contact.header.eyebrow}
          </h2>
          <ul className="mt-4 space-y-4">
            {contact.items.map((item) => (
              <li key={item.title} className="space-y-1">
                <p className="text-sm font-medium text-stone-900">
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed text-stone-600">
                  {item.description}
                </p>
                {item.action ? (
                  <Link
                    href={item.action.href}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:text-emerald-600"
                  >
                    <span className="kv-underline">{item.action.label}</span>
                    <span className="kv-nudge">&rarr;</span>
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-stone-500">{enquiry.loading}</div>}
    >
      <EnquiryPageContent />
    </Suspense>
  );
}
