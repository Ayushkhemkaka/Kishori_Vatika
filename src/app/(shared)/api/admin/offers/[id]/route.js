import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbClient } from "@/app/(shared)/lib/db-client";
import { logAdminActivity, logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = session.user.id ?? null;
  const { id } = await params;
  try {
    const { data: offer, error } = await dbClient.from('"Offer"').select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt").eq("id", id).maybeSingle();
    if (error || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    const [featuresRes, publicationsRes] = await Promise.all([
      dbClient.from('"OfferFeature"').select("id,label,value").eq("offerId", id),
      dbClient.from('"OfferPublication"').select("id,platform,status,externalPostId,errorMessage,createdAt").eq("offerId", id).order("createdAt", { ascending: false })
    ]);
    await logAdminActivity({
      adminId,
      action: "offer.update",
      entity: "Offer",
      entityId: offer.id
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
        value: f.value
      })),
      publications: (publicationsRes.data ?? []).map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: new Date(p.createdAt).toISOString()
      }))
    });
  } catch (e) {
    console.error("Admin offer get error:", e);
    return NextResponse.json(
      { error: "Failed to load offer" },
      { status: 500 }
    );
  }
}
async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = session.user.id ?? null;
  const { id } = await params;
  try {
    const body = await request.json();
    const offerData = {};
    if (body.title != null) offerData.title = body.title;
    if (body.description != null) offerData.description = body.description;
    if (body.price != null) offerData.price = Number(body.price);
    if (body.validFrom != null) offerData.validFrom = new Date(body.validFrom).toISOString();
    if (body.validTo != null) offerData.validTo = new Date(body.validTo).toISOString();
    if (body.isActive != null) offerData.isActive = body.isActive;
    if (body.heroImageUrl !== void 0) offerData.heroImageUrl = body.heroImageUrl ?? null;
    if (Object.keys(offerData).length > 0) {
      await dbClient.from('"Offer"').update(offerData).eq("id", id);
    }
    if (body.features) {
      await dbClient.from('"OfferFeature"').delete().eq("offerId", id);
      if (body.features.length > 0) {
        await dbClient.from('"OfferFeature"').insert(
          body.features.map((f) => ({
            offerId: id,
            label: f.label,
            value: f.value
          }))
        );
      }
    }
    const { data: offer } = await dbClient.from('"Offer"').select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt").eq("id", id).maybeSingle();
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const [featuresRes, publicationsRes] = await Promise.all([
      dbClient.from('"OfferFeature"').select("id,label,value").eq("offerId", id),
      dbClient.from('"OfferPublication"').select("id,platform,status,externalPostId,errorMessage,createdAt").eq("offerId", id).order("createdAt", { ascending: false })
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
        value: f.value
      })),
      publications: (publicationsRes.data ?? []).map((p) => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        externalPostId: p.externalPostId,
        errorMessage: p.errorMessage,
        createdAt: new Date(p.createdAt).toISOString()
      }))
    });
  } catch (e) {
    console.error("Admin offer update error:", e);
    await logError({
      message: "Admin offer update failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/admin/offers/[id]",
      context: { adminId, id }
    });
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
export { GET };
export { PATCH };

