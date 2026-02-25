"use client";
import { useState } from "react";
function ContactForm() {
  const [formState, setFormState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  async function handleSubmit(e) {
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
          phone: phone || void 0,
          message
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setFormState("error");
        setErrorMessage(data?.error ?? "Failed to send message");
        return;
      }
      setFormState("submitted");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setFormState("error");
      setErrorMessage("Network error. Please try again.");
    }
  }
  return <form
    onSubmit={handleSubmit}
    className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40"
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
        <div className="space-y-1.5 sm:col-span-2">
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
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-stone-700">
          Message
        </label>
        <textarea
    required
    rows={4}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-0 transition focus:border-emerald-400"
    placeholder="Tell us how we can help"
  />
      </div>

      <button
    type="submit"
    disabled={formState === "submitting"}
    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
  >
        {formState === "submitting" ? "Sending..." : formState === "submitted" ? "Message sent" : "Send message"}
      </button>

      {formState === "error" && errorMessage && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errorMessage}
        </p>}

      {formState === "submitted" && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Thanks for reaching out. We will respond within 24 hours.
        </p>}
    </form>;
}
export { ContactForm };
