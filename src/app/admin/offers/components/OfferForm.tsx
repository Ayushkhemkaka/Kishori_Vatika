"use client";

import { useState } from "react";
import Link from "next/link";

type FeatureRow = { id: string; label: string; value: string };

type Initial = {
  id: string;
  title: string;
  description: string;
  price: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  heroImageUrl: string;
  features: FeatureRow[];
  publications?: { platform: string; status: string }[];
};

type Props = { initial?: Initial };

export function OfferForm({ initial }: Props) {
  const isEdit = !!initial?.id;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [validFrom, setValidFrom] = useState(
    initial?.validFrom?.slice(0, 16) ?? ""
  );
  const [validTo, setValidTo] = useState(
    initial?.validTo?.slice(0, 16) ?? ""
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [heroImageUrl, setHeroImageUrl] = useState(
    initial?.heroImageUrl ?? ""
  );
  const [features, setFeatures] = useState<FeatureRow[]>(
    initial?.features?.length
      ? initial.features.map((f) => ({ ...f, id: f.id || `f-${Math.random()}` }))
      : [{ id: "f1", label: "", value: "" }]
  );
  const [postToFacebook, setPostToFacebook] = useState(false);
  const [postToInstagram, setPostToInstagram] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(initial?.id ?? null);

  function addFeature() {
    setFeatures((prev) => [
      ...prev,
      { id: `f-${Date.now()}`, label: "", value: "" },
    ]);
  }

  function updateFeature(id: string, field: "label" | "value", value: string) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  }

  function removeFeature(id: string) {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        price: Number(price),
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        isActive,
        heroImageUrl: heroImageUrl.trim() || null,
        features: features
          .filter((f) => f.label.trim() || f.value.trim())
          .map((f) => ({ id: f.id.startsWith("f-") ? undefined : f.id, label: f.label, value: f.value })),
      };

      let offerId: string;
      if (isEdit && initial?.id) {
        const res = await fetch(`/api/admin/offers/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to update");
        offerId = data.id;
      } else {
        const res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to create");
        offerId = data.id;
      }

      setSavedId(offerId);

      const platforms: string[] = [];
      if (postToFacebook) platforms.push("FACEBOOK");
      if (postToInstagram) platforms.push("INSTAGRAM");
      if (platforms.length > 0) {
        const pubRes = await fetch("/api/social/publish-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerId, platforms }),
        });
        if (!pubRes.ok) {
          const pubData = await pubRes.json();
          setError(
            `Offer saved but social post failed: ${pubData.error ?? pubRes.statusText}`
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Price (₹)
          </label>
          <input
            required
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300">
          Description
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Valid from
          </label>
          <input
            required
            type="datetime-local"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Valid to
          </label>
          <input
            required
            type="datetime-local"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300">
          Hero image URL (optional)
        </label>
        <input
          type="url"
          value={heroImageUrl}
          onChange={(e) => setHeroImageUrl(e.target.value)}
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50"
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-slate-600"
        />
        <span className="text-sm text-slate-300">Active (visible on site)</span>
      </label>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">
            Features (e.g. Breakfast: Daily)
          </span>
          <button
            type="button"
            onClick={addFeature}
            className="text-xs text-amber-200 hover:text-amber-100"
          >
            + Add
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {features.map((f) => (
            <li key={f.id} className="flex gap-2">
              <input
                value={f.label}
                onChange={(e) => updateFeature(f.id, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 rounded border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-sm text-slate-50"
              />
              <input
                value={f.value}
                onChange={(e) => updateFeature(f.id, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 rounded border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-sm text-slate-50"
              />
              <button
                type="button"
                onClick={() => removeFeature(f.id)}
                className="text-slate-400 hover:text-rose-400"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3">
          <p className="text-xs font-medium text-amber-200">
            Auto-post to social when saving
          </p>
          <label className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={postToFacebook}
              onChange={(e) => setPostToFacebook(e.target.checked)}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Post to Facebook</span>
          </label>
          <label className="mt-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={postToInstagram}
              onChange={(e) => setPostToInstagram(e.target.checked)}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Post to Instagram</span>
          </label>
        </div>

      {error && (
        <p className="rounded-lg border border-rose-400/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-50">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update offer" : "Create offer"}
        </button>
        {savedId && (
          <Link
            href={`/admin/offers/${savedId}/edit`}
            className="text-sm text-amber-200 hover:text-amber-100"
          >
            Edit offer
          </Link>
        )}
        <Link
          href="/admin/offers"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back to offers
        </Link>
      </div>
    </form>
  );
}
