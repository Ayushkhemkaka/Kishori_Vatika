import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { features: true, publications: { orderBy: { createdAt: "desc" } } },
    });
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      price: offer.price.toString(),
      validFrom: offer.validFrom.toISOString(),
      validTo: offer.validTo.toISOString(),
      isActive: offer.isActive,
      heroImageUrl: offer.heroImageUrl,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      features: offer.features.map((f) => ({ id: f.id, label: f.label, value: f.value })),
      publications: offer.publications.map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("Admin offer get error:", e);
    return NextResponse.json(
      { error: "Failed to load offer" },
      { status: 500 }
    );
  }
}

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
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      price?: number | string;
      validFrom?: string;
      validTo?: string;
      isActive?: boolean;
      heroImageUrl?: string | null;
      features?: { id?: string; label: string; value: string }[];
    };

    const existing = await prisma.offer.findUnique({ where: { id }, include: { features: true } });
    if (!existing) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const features = body.features ?? [];
    const existingIds = new Set(existing.features.map((f) => f.id));
    const incomingIds = new Set(features.map((f) => f.id).filter(Boolean));
    const offerData: {
      title?: string;
      description?: string;
      price?: number;
      validFrom?: Date;
      validTo?: Date;
      isActive?: boolean;
      heroImageUrl?: string | null;
    } = {};

    if (body.title != null) offerData.title = body.title;
    if (body.description != null) offerData.description = body.description;
    if (body.price != null) offerData.price = Number(body.price);
    if (body.validFrom != null) offerData.validFrom = new Date(body.validFrom);
    if (body.validTo != null) offerData.validTo = new Date(body.validTo);
    if (body.isActive != null) offerData.isActive = body.isActive;
    if (body.heroImageUrl !== undefined) offerData.heroImageUrl = body.heroImageUrl ?? null;

    await prisma.$transaction(async (tx) => {
      if (Object.keys(offerData).length > 0) {
        await tx.offer.update({ where: { id }, data: offerData });
      }

      for (const f of features) {
        if (f.id && existingIds.has(f.id)) {
          await tx.offerFeature.update({
            where: { id: f.id },
            data: { label: f.label, value: f.value },
          });
        } else {
          await tx.offerFeature.create({
            data: { offerId: id, label: f.label, value: f.value },
          });
        }
      }
      for (const fid of existingIds) {
        if (!incomingIds.has(fid)) {
          await tx.offerFeature.delete({ where: { id: fid } });
        }
      }
    });

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { features: true, publications: { orderBy: { createdAt: "desc" } } },
    });
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      price: offer.price.toString(),
      validFrom: offer.validFrom.toISOString(),
      validTo: offer.validTo.toISOString(),
      isActive: offer.isActive,
      heroImageUrl: offer.heroImageUrl,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      features: offer.features.map((f) => ({ id: f.id, label: f.label, value: f.value })),
      publications: offer.publications.map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("Admin offer update error:", e);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
