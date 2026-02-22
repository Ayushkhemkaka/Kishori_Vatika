import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        features: true,
        publications: { orderBy: { createdAt: "desc" } },
      },
    });
    return NextResponse.json(
      offers.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        price: o.price.toString(),
        validFrom: o.validFrom.toISOString(),
        validTo: o.validTo.toISOString(),
        isActive: o.isActive,
        heroImageUrl: o.heroImageUrl,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        features: o.features.map((f) => ({
          id: f.id,
          label: f.label,
          value: f.value,
        })),
        publications: o.publications.map((p) => ({
          id: p.id,
          platform: p.platform,
          status: p.status,
          externalPostId: p.externalPostId,
          errorMessage: p.errorMessage,
          createdAt: p.createdAt.toISOString(),
        })),
      }))
    );
  } catch (e) {
    console.error("Admin offers list error:", e);
    return NextResponse.json(
      { error: "Failed to list offers" },
      { status: 500 }
    );
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  price?: number | string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  heroImageUrl?: string | null;
  features?: Array<{ label: string; value: string }>;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CreateBody;
    const title = body.title;
    const description = body.description;
    const price = body.price;
    const validFrom = body.validFrom;
    const validTo = body.validTo;
    const isActive = body.isActive !== false;
    const heroImageUrl = body.heroImageUrl;
    const features = body.features || [];

    if (!title || !description || price == null || !validFrom || !validTo) {
      return NextResponse.json(
        { error: "title, description, price, validFrom, validTo are required" },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        price: Number(price),
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        isActive,
        heroImageUrl: heroImageUrl ?? null,
        features: {
          create: features.map((f) => ({
            label: f.label || "",
            value: f.value || "",
          })),
        },
      },
      include: { features: true, publications: true },
    });

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
      features: offer.features.map((f) => ({
        id: f.id,
        label: f.label,
        value: f.value,
      })),
      publications: offer.publications,
    });
  } catch (e) {
    console.error("Admin offer create error:", e);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
