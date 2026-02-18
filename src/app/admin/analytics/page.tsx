import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "../_components/AnalyticsCharts";

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [visits, eventsByType, offerClicksByOffer, enquiriesWithOffer] = await Promise.all([
    prisma.visit.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, sessionId: true, path: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["offerId"],
      where: {
        type: "OFFER_CLICK",
        createdAt: { gte: thirtyDaysAgo },
        offerId: { not: null },
      },
      _count: { offerId: true },
    }),
    prisma.enquiry.count({
      where: { offerId: { not: null }, createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const visitsByDay = new Map<string, number>();
  const uniqueSessionsByDay = new Map<string, Set<string>>();
  const uniqueSessionIds = new Set<string>();
  for (const v of visits) {
    const day = v.createdAt.toISOString().slice(0, 10);
    visitsByDay.set(day, (visitsByDay.get(day) ?? 0) + 1);
    uniqueSessionIds.add(v.sessionId);
    if (!uniqueSessionsByDay.has(day))
      uniqueSessionsByDay.set(day, new Set());
    uniqueSessionsByDay.get(day)!.add(v.sessionId);
  }

  const typeCounts = Object.fromEntries(
    eventsByType.map((e) => [e.type, e._count])
  );

  const offerIds = offerClicksByOffer
    .map((e) => e.offerId)
    .filter((id): id is string => Boolean(id));
  const offerClickCountMap = new Map(
    offerClicksByOffer.map((entry) => [entry.offerId, entry._count.offerId])
  );
  const offerTitles = offerIds.length
    ? await prisma.offer.findMany({
        where: { id: { in: offerIds } },
        select: { id: true, title: true },
      })
    : [];
  const titleMap = Object.fromEntries(offerTitles.map((o) => [o.id, o.title]));

  const chartData = [...visitsByDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date]) => ({
      date,
      visits: visitsByDay.get(date) ?? 0,
      uniqueSessions: uniqueSessionsByDay.get(date)?.size ?? 0,
    }));

  const offerData = offerIds.map((id) => ({
    offerId: id,
    title: titleMap[id] ?? id.slice(0, 8),
    clicks: offerClickCountMap.get(id) ?? 0,
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
            {uniqueSessionIds.size}
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
