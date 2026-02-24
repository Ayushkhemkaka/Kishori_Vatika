import { supabase } from "@/(shared)/lib/supabase";
import { AnalyticsCharts } from "./components/AnalyticsCharts";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type VisitRow = { createdAt: string; sessionId: string };

type AnalyticsRow = {
  type: string;
  offerId: string | null;
  createdAt: string;
};

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [visitsRes, eventsRes, enquiriesRes] = await Promise.all([
    supabase
      .from('"Visit"')
      .select("createdAt,sessionId")
      .gte("createdAt", thirtyDaysAgo.toISOString()),
    supabase
      .from('"AnalyticsEvent"')
      .select("type,offerId,createdAt")
      .gte("createdAt", thirtyDaysAgo.toISOString()),
    supabase
      .from('"Enquiry"')
      .select("id", { count: "exact", head: true })
      .not("offerId", "is", null)
      .gte("createdAt", thirtyDaysAgo.toISOString()),
  ]);

  const visits = (visitsRes.data ?? []) as VisitRow[];
  const events = (eventsRes.data ?? []) as AnalyticsRow[];
  const enquiriesWithOffer = enquiriesRes.count ?? 0;

  const visitsByDayMap = new Map<string, { visits: number; sessions: Set<string> }>();
  const uniqueSessionsSet = new Set<string>();
  for (const visit of visits) {
    const date = new Date(visit.createdAt).toISOString().slice(0, 10);
    uniqueSessionsSet.add(visit.sessionId);
    const entry = visitsByDayMap.get(date) ?? { visits: 0, sessions: new Set() };
    entry.visits += 1;
    entry.sessions.add(visit.sessionId);
    visitsByDayMap.set(date, entry);
  }

  const visitsByDay = Array.from(visitsByDayMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, value]) => ({
      date,
      visits: value.visits,
      uniqueSessions: value.sessions.size,
    }));

  const typeCounts: Record<string, number> = {};
  const offerClicks: Record<string, number> = {};
  for (const event of events) {
    typeCounts[event.type] = (typeCounts[event.type] ?? 0) + 1;
    if (event.type === "OFFER_CLICK" && event.offerId) {
      offerClicks[event.offerId] = (offerClicks[event.offerId] ?? 0) + 1;
    }
  }

  const offerIds = Object.keys(offerClicks);
  const { data: offers } = offerIds.length
    ? await supabase.from('"Offer"').select("id,title").in("id", offerIds)
    : { data: [] };
  const titleMap = Object.fromEntries((offers ?? []).map((o) => [o.id, o.title]));

  const chartData = visitsByDay.map((entry) => ({
    date: entry.date,
    visits: entry.visits,
    uniqueSessions: entry.uniqueSessions,
  }));

  const offerData = offerIds.map((id) => ({
    offerId: id,
    title: titleMap[id] ?? id.slice(0, 8),
    clicks: offerClicks[id] ?? 0,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-amber-50">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">
            {typeCounts.PAGE_VIEW ?? 0}
          </p>
          <p className="text-sm text-slate-400">Page views (30 days)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">
            {uniqueSessionsSet.size}
          </p>
          <p className="text-sm text-slate-400">Unique sessions (30 days)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-2xl font-semibold text-amber-100">
            {enquiriesWithOffer}
          </p>
          <p className="text-sm text-slate-400">Enquiries with offer (30 days)</p>
        </div>
      </div>

      <AnalyticsCharts chartData={chartData} offerData={offerData} />
    </div>
  );
}
