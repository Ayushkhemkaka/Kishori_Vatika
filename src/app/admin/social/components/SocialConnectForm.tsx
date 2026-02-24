"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SocialConnectForm() {
  const router = useRouter();
  const [platform, setPlatform] = useState<"FACEBOOK" | "INSTAGRAM">("FACEBOOK");
  const [pageId, setPageId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/social/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          pageId: platform === "FACEBOOK" ? pageId : undefined,
          accountId: platform === "INSTAGRAM" ? accountId : undefined,
          accessToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to save");
        setSaving(false);
        return;
      }
      setMessage(data.message ?? "Saved.");
      setAccessToken("");
      if (platform === "FACEBOOK") setPageId("");
      else setAccountId("");
      router.refresh();
    } catch {
      setMessage("Network error");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-sm font-medium text-amber-100">Add or update account</h2>
      <div>
        <label className="block text-xs text-slate-400">Platform</label>
        <select
          value={platform}
          onChange={(e) =>
            setPlatform(e.target.value as "FACEBOOK" | "INSTAGRAM")
          }
          className="mt-1 rounded border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
        >
          <option value="FACEBOOK">Facebook Page</option>
          <option value="INSTAGRAM">Instagram Business</option>
        </select>
      </div>
      {platform === "FACEBOOK" && (
        <div>
          <label className="block text-xs text-slate-400">Page ID</label>
          <input
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            placeholder="From Meta Graph API"
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
      )}
      {platform === "INSTAGRAM" && (
        <div>
          <label className="block text-xs text-slate-400">Instagram Business Account ID</label>
          <input
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="ig-user-id from Graph API"
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
      )}
      <div>
        <label className="block text-xs text-slate-400">Access token (long-lived)</label>
        <input
          required
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Paste token from Meta Developer"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
        />
      </div>
      {message && (
        <p className="text-sm text-amber-200">{message}</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
