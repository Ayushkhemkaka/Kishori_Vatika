import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

const VALID_STATUSES = ["NEW", "CONTACTED", "BOOKED", "CANCELLED"];

type EnquiryRow = {
  id: string;
  status: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await request.json()) as { status?: string };
    const status = body.status;
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: enquiry, error } = await supabase
      .from('"Enquiry"')
      .update({ status })
      .eq("id", id)
      .select("id,status")
      .maybeSingle();

    if (error || !enquiry) {
      return NextResponse.json(
        { error: "Failed to update enquiry" },
        { status: 500 }
      );
    }

    const payload = enquiry as EnquiryRow;
    return NextResponse.json({ id: payload.id, status: payload.status });
  } catch (e) {
    console.error("Enquiry update error:", e);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
