import { prisma } from "@/lib/db";
import { EnquiryStatusSelect } from "../_components/EnquiryStatusSelect";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { offer: { select: { id: true, title: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-amber-50">Enquiries</h1>
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
    </div>
  );
}
