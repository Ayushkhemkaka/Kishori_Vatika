import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { OfferForm } from "../../_components/OfferForm";

export const dynamic = "force-dynamic";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { features: true, publications: { orderBy: { createdAt: "desc" } } },
  });
  if (!offer) notFound();

  const initial = {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    price: offer.price.toString(),
    validFrom: offer.validFrom.toISOString().slice(0, 16),
    validTo: offer.validTo.toISOString().slice(0, 16),
    isActive: offer.isActive,
    heroImageUrl: offer.heroImageUrl ?? "",
    features: offer.features.map((f) => ({ id: f.id, label: f.label, value: f.value })),
    publications: offer.publications.map((p) => ({
      id: p.id,
      platform: p.platform,
      status: p.status,
      externalPostId: p.externalPostId,
      errorMessage: p.errorMessage,
      createdAt: p.createdAt.toISOString(),
    })),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-amber-50">Edit offer</h1>
      <OfferForm initial={initial} />
    </div>
  );
}
