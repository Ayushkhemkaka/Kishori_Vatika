"use client";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
const DEVICE_COOKIE_NAME = "admin-device";
const DEVICE_COOKIE_MAXAGE = 60 * 60 * 24 * 365;

function buildDeviceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function readDeviceId() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${DEVICE_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeDeviceId(value) {
  if (typeof document === "undefined") return;
  document.cookie = `${DEVICE_COOKIE_NAME}=${encodeURIComponent(value)}; max-age=${DEVICE_COOKIE_MAXAGE}; path=/; samesite=lax`;
}
function AdminLoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(() => readDeviceId() ?? buildDeviceId());

  useEffect(() => {
    if (!deviceId) return;
    const existing = readDeviceId();
    if (existing === deviceId) return;
    writeDeviceId(deviceId);
  }, [deviceId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        deviceId,
        redirect: false,
        callbackUrl
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
  return <div className="mx-auto max-w-sm space-y-6 pt-12">
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
        {error && <p className="text-sm text-rose-400">{error}</p>}
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
    </div>;
}
function AdminLoginPage() {
  return <Suspense fallback={<div className="pt-12 text-sm text-slate-400">Loading login...</div>}>
      <AdminLoginPageContent />
    </Suspense>;
}
export default AdminLoginPage;
