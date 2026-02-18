"use client";

import { useRouter } from "next/navigation";
import { EnquiryStatus } from "@prisma/client";

const LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  BOOKED: "Booked",
  CANCELLED: "Cancelled",
};

export function EnquiryStatusSelect({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: EnquiryStatus;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as EnquiryStatus;
    const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="rounded border border-slate-600 bg-slate-900/80 px-2 py-1 text-xs text-slate-200"
    >
      {(Object.keys(LABELS) as EnquiryStatus[]).map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
