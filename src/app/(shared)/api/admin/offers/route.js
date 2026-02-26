import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbClient } from "@/app/(shared)/lib/db-client";
import { logAdminActivity, logError } from "@/app/(shared)/lib/audit";
export const runtime = "edge";
async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = session.user.id ?? null;
  try {
    const { data: offersData, error: offersError } = await dbClient.from('"Offer"').select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt").order("createdAt", { ascending: false });
    if (offersError) throw offersError;
    const offers = offersData ?? [];
    const offerIds = offers.map((o) => o.id);
    const [featuresRes, publicationsRes] = await Promise.all([
      offerIds.length ? dbClient.from('"OfferFeature"').select("id,offerId,label,value").in("offerId", offerIds) : Promise.resolve({ data: [] }),
      offerIds.length ? dbClient.from('"OfferPublication"').select("id,offerId,platform,status,externalPostId,errorMessage,createdAt").in("offerId", offerIds).order("createdAt", { ascending: false }) : Promise.resolve({ data: [] })
    ]);
    const features = featuresRes.data ?? [];
    const publications = publicationsRes.data ?? [];
    const featureMap = /* @__PURE__ */ new Map();
    for (const feature of features) {
      const list = featureMap.get(feature.offerId) ?? [];
      list.push(feature);
      featureMap.set(feature.offerId, list);
    }
    const publicationMap = /* @__PURE__ */ new Map();
    for (const pub of publications) {
      const list = publicationMap.get(pub.offerId) ?? [];
      list.push(pub);
      publicationMap.set(pub.offerId, list);
    }
    return NextResponse.json(
      offers.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        price: o.price.toString(),
        validFrom: new Date(o.validFrom).toISOString(),
        validTo: new Date(o.validTo).toISOString(),
        isActive: o.isActive,
        heroImageUrl: o.heroImageUrl,
        createdAt: new Date(o.createdAt).toISOString(),
        updatedAt: new Date(o.updatedAt).toISOString(),
        features: (featureMap.get(o.id) ?? []).map((f) => ({
          id: f.id,
          label: f.label,
          value: f.value
        })),
        publications: (publicationMap.get(o.id) ?? []).map((p) => ({
          id: p.id,
          platform: p.platform,
          status: p.status,
          externalPostId: p.externalPostId,
          errorMessage: p.errorMessage,
          createdAt: new Date(p.createdAt).toISOString()
        }))
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
async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = session.user.id ?? null;
  try {
    const body = await request.json();
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
    const { data: created, error: createError } = await dbClient.from('"Offer"').insert({
      title,
      description,
      price: Number(price),
      validFrom: new Date(validFrom).toISOString(),
      validTo: new Date(validTo).toISOString(),
      isActive,
      heroImageUrl: heroImageUrl ?? null
    }).select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl,createdAt,updatedAt").maybeSingle();
    if (createError || !created) {
      throw createError;
    }
    const featureRows = features.map((f) => ({
      offerId: created.id,
      label: f.label || "",
      value: f.value || ""
    }));
    const { data: createdFeatures } = featureRows.length ? await dbClient.from('"OfferFeature"').insert(featureRows).select("id,label,value") : { data: [] };
    await logAdminActivity({
      adminId,
      action: "offer.create",
      entity: "Offer",
      entityId: created.id
    });
    return NextResponse.json({
      id: created.id,
      title: created.title,
      description: created.description,
      price: created.price.toString(),
      validFrom: new Date(created.validFrom).toISOString(),
      validTo: new Date(created.validTo).toISOString(),
      isActive: created.isActive,
      heroImageUrl: created.heroImageUrl,
      createdAt: new Date(created.createdAt).toISOString(),
      updatedAt: new Date(created.updatedAt).toISOString(),
      features: (createdFeatures ?? []).map((f) => ({
        id: f.id,
        label: f.label,
        value: f.value
      })),
      publications: []
    });
  } catch (e) {
    console.error("Admin offer create error:", e);
    await logError({
      message: "Admin offer create failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/admin/offers",
      context: { adminId }
    });
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
export { GET };
export { POST };

