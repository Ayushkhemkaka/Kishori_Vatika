"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      if (result?.url) window.location.href = result.url;
      else window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-12">
      <h1 className="text-xl font-semibold text-amber-50">Owner login</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-white/10 bg-slate-900/60 p-6"
      >
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
            placeholder="owner@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
        {error && (
          <p className="text-sm text-rose-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-400">
        Use your owner account to manage offers and enquiries.
      </p>
    </div>
  );
}
