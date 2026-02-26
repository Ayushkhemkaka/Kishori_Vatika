import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbClient } from "@/app/(shared)/lib/db-client";
import { logAdminActivity, logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
const VALID_STATUSES = ["NEW", "CONTACTED", "BOOKED", "CANCELLED"];
async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = session.user.id ?? null;
  const { id } = await params;
  try {
    const body = await request.json();
    const status = body.status;
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const { data: enquiry, error } = await dbClient.from('"Enquiry"').update({ status }).eq("id", id).select("id,status").maybeSingle();
    if (error || !enquiry) {
      return NextResponse.json(
        { error: "Failed to update enquiry" },
        { status: 500 }
      );
    }
    const payload = enquiry;
    await logAdminActivity({
      adminId,
      action: "enquiry.update",
      entity: "Enquiry",
      entityId: payload.id,
      metadata: { status: payload.status }
    });
    return NextResponse.json({ id: payload.id, status: payload.status });
  } catch (e) {
    console.error("Enquiry update error:", e);
    await logError({
      message: "Admin enquiry update failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/admin/enquiries/[id]",
      context: { adminId, id }
    });
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
export { PATCH };

