import Link from "next/link";
import { prisma } from "@/lib/db";
import { EnquiryStatusSelect } from "../_components/EnquiryStatusSelect";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [enquiries, totalCount] = await Promise.all([
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { offer: { select: { id: true, title: true } } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.enquiry.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-amber-50">Enquiries</h1>
        <p className="text-sm text-slate-400">
          {totalCount} total
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-slate-900/60">
            <tr>
              <th className="px-4 py-3 font-medium text-amber-100">Name</th>
              <th className="px-4 py-3 font-medium text-amber-100">Email</th>
              <th className="px-4 py-3 font-medium text-amber-100">Dates</th>
              <th className="px-4 py-3 font-medium text-amber-100">Offer</th>
              <th className="px-4 py-3 font-medium text-amber-100">Status</th>
              <th className="px-4 py-3 font-medium text-amber-100">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No enquiries yet.
                </td>
              </tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e.id} className="bg-slate-950/40">
                  <td className="px-4 py-3 text-slate-200">{e.name}</td>
                  <td className="px-4 py-3 text-slate-200">{e.email}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(e.checkIn).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    –{" "}
                    {new Date(e.checkOut).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {e.offer ? e.offer.title : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <EnquiryStatusSelect enquiryId={e.id} currentStatus={e.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/enquiries?page=${Math.max(1, currentPage - 1)}`}
            aria-disabled={!hasPrev}
            className={`rounded-full border px-4 py-2 text-sm ${
              hasPrev
                ? "border-white/20 text-slate-200 hover:bg-white/5"
                : "pointer-events-none border-white/10 text-slate-500"
            }`}
          >
            Previous
          </Link>
          <Link
            href={`/admin/enquiries?page=${Math.min(totalPages, currentPage + 1)}`}
            aria-disabled={!hasNext}
            className={`rounded-full border px-4 py-2 text-sm ${
              hasNext
                ? "border-white/20 text-slate-200 hover:bg-white/5"
                : "pointer-events-none border-white/10 text-slate-500"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
