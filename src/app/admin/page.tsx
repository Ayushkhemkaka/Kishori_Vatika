import Link from "next/link";
import { supabase } from "@/(shared)/lib/supabase";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [visitCountRes, enquiryCountRes, offerCountRes] = await Promise.all([
    supabase.from('"Visit"').select("id", { count: "exact", head: true }),
    supabase.from('"Enquiry"').select("id", { count: "exact", head: true }),
    supabase
      .from('"Offer"')
      .select("id", { count: "exact", head: true })
      .eq("isActive", true),
  ]);
  const visitCount = visitCountRes.count ?? 0;
  const enquiryCount = enquiryCountRes.count ?? 0;
  const offerCount = offerCountRes.count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-amber-50">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">{visitCount}</p>
          <p className="text-sm text-slate-400">Total visits</p>
          <Link href="/admin/analytics" className="mt-2 text-xs text-amber-200 hover:text-amber-100">
            View analytics →
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">{enquiryCount}</p>
          <p className="text-sm text-slate-400">Enquiries</p>
          <Link href="/admin/enquiries" className="mt-2 text-xs text-amber-200 hover:text-amber-100">
            Manage enquiries →
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">{offerCount}</p>
          <p className="text-sm text-slate-400">Active offers</p>
          <Link href="/admin/offers" className="mt-2 text-xs text-amber-200 hover:text-amber-100">
            Manage offers →
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/offers"
          className="rounded-xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-amber-400/40"
        >
          <h2 className="font-medium text-amber-100">Offers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create and edit offers. Auto-post to Facebook and Instagram when you publish.
          </p>
        </Link>
        <Link
          href="/admin/social"
          className="rounded-xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-amber-400/40"
        >
          <h2 className="font-medium text-amber-100">Social accounts</h2>
          <p className="mt-1 text-sm text-slate-400">
            Connect your Facebook Page and Instagram Business account for auto-posting.
          </p>
        </Link>
      </div>
    </div>
  );
}
