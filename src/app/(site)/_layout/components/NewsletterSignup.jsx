"use client";
import { useState } from "react";
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setState("submitting");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setError(data?.error ?? "Failed to subscribe");
        return;
      }
      setState("submitted");
      setEmail("");
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }
  return <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email for updates"
    className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-400 sm:w-64"
  />
      <button
    type="submit"
    disabled={state === "submitting"}
    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
  >
        {state === "submitting" ? "Joining..." : state === "submitted" ? "Subscribed" : "Join updates"}
      </button>
      {state === "error" && <span className="text-xs text-rose-700">{error}</span>}
    </form>;
}
export { NewsletterSignup };
