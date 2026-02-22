import Link from "next/link";
import { prisma } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      isActive: true,
      _count: { select: { publications: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-amber-50">Offers</h1>
        <Link
          href="/admin/offers/new"
          className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
        >
          New offer
        </Link>
      </div>

      <ul className="space-y-3">
        {offers.length === 0 ? (
          <li className="rounded-xl border border-white/10 bg-slate-900/40 p-6 text-center text-slate-400">
            No offers yet. Create one to get started.
          </li>
        ) : (
          offers.map((offer) => (
            <li
              key={offer.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 p-4"
            >
              <div>
                <h2 className="font-medium text-amber-50">{offer.title}</h2>
                <p className="text-sm text-slate-400">
                  {offer.isActive ? "Active" : "Inactive"} - {offer._count.publications} publication(s)
                </p>
              </div>
              <Link
                href={`/admin/offers/${offer.id}/edit`}
                className="rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-400/20"
              >
                Edit
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
