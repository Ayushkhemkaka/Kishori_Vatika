import { notFound } from "next/navigation";
import { supabase } from "@/app/(shared)/lib/supabase";
import { OfferForm } from "../../components/OfferForm";
export const runtime = "edge";
export const dynamic = "force-dynamic";
async function EditOfferPage({
  params
}) {
  const { id } = await params;
  const { data: offer } = await supabase.from('"Offer"').select("id,title,description,price,validFrom,validTo,isActive,heroImageUrl").eq("id", id).maybeSingle();
  if (!offer) notFound();
  const { data: features } = await supabase.from('"OfferFeature"').select("id,label,value").eq("offerId", id);
  const { data: publications } = await supabase.from('"OfferPublication"').select("id,platform,status,externalPostId,errorMessage,createdAt").eq("offerId", id).order("createdAt", { ascending: false });
  const initial = {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    price: offer.price.toString(),
    validFrom: new Date(offer.validFrom).toISOString().slice(0, 16),
    validTo: new Date(offer.validTo).toISOString().slice(0, 16),
    isActive: offer.isActive,
    heroImageUrl: offer.heroImageUrl ?? "",
    features: (features ?? []).map((f) => ({ id: f.id, label: f.label, value: f.value })),
    publications: (publications ?? []).map((p) => ({
      id: p.id,
      platform: p.platform,
      status: p.status,
      externalPostId: p.externalPostId,
      errorMessage: p.errorMessage,
      createdAt: new Date(p.createdAt).toISOString()
    }))
  };
  return <div className="space-y-6">
      <h1 className="text-xl font-semibold text-amber-50">Edit offer</h1>
      <OfferForm initial={initial} />
    </div>;
}
export default EditOfferPage;
