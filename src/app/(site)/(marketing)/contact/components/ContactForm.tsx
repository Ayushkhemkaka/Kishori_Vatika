"use client";

import { useState } from "react";
import { contactForm } from "@/content/site-content";

type FormState = "idle" | "submitting" | "submitted" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormState("error");
        setErrorMessage(data?.error ?? contactForm.genericError);
        return;
      }

      setFormState("submitted");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setFormState("error");
      setErrorMessage(contactForm.networkError);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-stone-700">
            {contactForm.fields.name.label}
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
            placeholder={contactForm.fields.name.placeholder}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-stone-700">
            {contactForm.fields.email.label}
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
            placeholder={contactForm.fields.email.placeholder}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium text-stone-700">
            {contactForm.fields.phone.label}
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
            placeholder={contactForm.fields.phone.placeholder}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-stone-700">
          {contactForm.fields.message.label}
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
          placeholder={contactForm.fields.message.placeholder}
        />
      </div>

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
      >
        {formState === "submitting"
          ? contactForm.submit.submitting
          : formState === "submitted"
            ? contactForm.submit.submitted
            : contactForm.submit.idle}
      </button>

      {formState === "error" && errorMessage && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errorMessage}
        </p>
      )}

      {formState === "submitted" && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {contactForm.success}
        </p>
      )}
    </form>
  );
}
