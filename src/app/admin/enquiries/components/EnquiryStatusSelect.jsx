"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const LABELS = {
  NEW: "New",
  CONTACTED: "Contacted",
  BOOKED: "Booked",
  CANCELLED: "Cancelled"
};
function EnquiryStatusSelect({
  enquiryId,
  currentStatus
}) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  async function handleChange(e) {
    const status = e.target.value;
    const previous = statusValue;
    setStatusValue(status);
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      setStatusValue(previous);
      setError("Failed to update");
      setSaving(false);
      return;
    }
    setSaving(false);
    router.prefetch("/admin/enquiries");
  }
  return <div className="space-y-1">
      <select
    value={statusValue}
    onChange={handleChange}
    disabled={saving}
    className="rounded border border-slate-600 bg-slate-900/80 px-2 py-1 text-xs text-slate-200 disabled:opacity-70"
  >
        {Object.keys(LABELS).map((s) => <option key={s} value={s}>
            {LABELS[s]}
          </option>)}
      </select>
      {error && <p className="text-[11px] text-rose-300">{error}</p>}
    </div>;
}
export { EnquiryStatusSelect };
