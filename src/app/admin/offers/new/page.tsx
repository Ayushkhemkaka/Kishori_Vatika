import { OfferForm } from "../components/OfferForm";

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-amber-50">New offer</h1>
      <OfferForm />
    </div>
  );
}
