import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EnquiryStatus } from "@prisma/client";

export const runtime = "edge";

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
    if (!status || !(Object.values(EnquiryStatus) as string[]).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status: status as EnquiryStatus },
    });
    return NextResponse.json({
      id: enquiry.id,
      status: enquiry.status,
    });
  } catch (e) {
    console.error("Enquiry update error:", e);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
