import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "../_components/AnalyticsCharts";

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [visitsByDay, uniqueSessionsResult, eventsByType, offerClicksByOffer, enquiriesWithOffer] = await Promise.all([
    prisma.$queryRaw<Array<{ date: string; visits: number; uniqueSessions: number }>>`
      SELECT
        to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS date,
        count(*)::int AS visits,
        count(DISTINCT "sessionId")::int AS "uniqueSessions"
      FROM "Visit"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `,
    prisma.$queryRaw<Array<{ uniqueSessions: number }>>`
      SELECT count(DISTINCT "sessionId")::int AS "uniqueSessions"
      FROM "Visit"
      WHERE "createdAt" >= ${thirtyDaysAgo}
    `,
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

  const chartData = visitsByDay.map((entry) => ({
    date: entry.date,
    visits: entry.visits,
    uniqueSessions: entry.uniqueSessions,
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
            {uniqueSessionsResult[0]?.uniqueSessions ?? 0}
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
