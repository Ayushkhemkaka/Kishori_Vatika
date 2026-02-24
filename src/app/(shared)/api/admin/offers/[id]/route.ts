import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/(shared)/lib/supabase";
import { logAdminActivity, logError } from "@/(shared)/lib/audit";

export const runtime = "edge";

type OfferRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  heroImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = (session.user as { id?: string }).id ?? null;
  const { id } = await params;
  try {
    const { data: offer, error } = await supabase
      .from('"Offer"')
      .select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt")
      .eq("id", id)
      .maybeSingle();
    if (error || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const [featuresRes, publicationsRes] = await Promise.all([
      supabase
        .from('"OfferFeature"')
        .select("id,label,value")
        .eq("offerId", id),
      supabase
        .from('"OfferPublication"')
        .select("id,platform,status,externalPostId,errorMessage,createdAt")
        .eq("offerId", id)
        .order("createdAt", { ascending: false }),
    ]);

    await logAdminActivity({
      adminId,
      action: "offer.update",
      entity: "Offer",
      entityId: offer.id,
    });

    return NextResponse.json({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      price: offer.price.toString(),
      validFrom: new Date(offer.validFrom).toISOString(),
      validTo: new Date(offer.validTo).toISOString(),
      isActive: offer.isActive,
      heroImageUrl: offer.heroImageUrl,
      createdAt: new Date(offer.createdAt).toISOString(),
      updatedAt: new Date(offer.updatedAt).toISOString(),
      features: (featuresRes.data ?? []).map((f) => ({
        id: f.id,
        label: f.label,
        value: f.value,
      })),
      publications: (publicationsRes.data ?? []).map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: new Date(p.createdAt).toISOString(),
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

    const offerData: {
      title?: string;
      description?: string;
      price?: number;
      validFrom?: string;
      validTo?: string;
      isActive?: boolean;
      heroImageUrl?: string | null;
    } = {};

    if (body.title != null) offerData.title = body.title;
    if (body.description != null) offerData.description = body.description;
    if (body.price != null) offerData.price = Number(body.price);
    if (body.validFrom != null) offerData.validFrom = new Date(body.validFrom).toISOString();
    if (body.validTo != null) offerData.validTo = new Date(body.validTo).toISOString();
    if (body.isActive != null) offerData.isActive = body.isActive;
    if (body.heroImageUrl !== undefined) offerData.heroImageUrl = body.heroImageUrl ?? null;

    if (Object.keys(offerData).length > 0) {
      await supabase.from('"Offer"').update(offerData).eq("id", id);
    }

    if (body.features) {
      await supabase.from('"OfferFeature"').delete().eq("offerId", id);
      if (body.features.length > 0) {
        await supabase.from('"OfferFeature"').insert(
          body.features.map((f) => ({
            offerId: id,
            label: f.label,
            value: f.value,
          }))
        );
      }
    }

    const { data: offer } = await supabase
      .from('"Offer"')
      .select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt")
      .eq("id", id)
      .maybeSingle();
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [featuresRes, publicationsRes] = await Promise.all([
      supabase
        .from('"OfferFeature"')
        .select("id,label,value")
        .eq("offerId", id),
      supabase
        .from('"OfferPublication"')
        .select("id,platform,status,externalPostId,errorMessage,createdAt")
        .eq("offerId", id)
        .order("createdAt", { ascending: false }),
    ]);

    return NextResponse.json({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      price: offer.price.toString(),
      validFrom: new Date(offer.validFrom).toISOString(),
      validTo: new Date(offer.validTo).toISOString(),
      isActive: offer.isActive,
      heroImageUrl: offer.heroImageUrl,
      createdAt: new Date(offer.createdAt).toISOString(),
      updatedAt: new Date(offer.updatedAt).toISOString(),
      features: (featuresRes.data ?? []).map((f) => ({
        id: f.id,
        label: f.label,
        value: f.value,
      })),
      publications: (publicationsRes.data ?? []).map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: new Date(p.createdAt).toISOString(),
      })),
    });
  } catch (e) {
    console.error("Admin offer update error:", e);
    await logError({
      message: "Admin offer update failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/admin/offers/[id]",
      context: { adminId, id },
    });
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
