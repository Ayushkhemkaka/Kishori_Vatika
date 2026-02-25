import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
const metadata = {
  title: "Contact",
  description: "Get in touch for bookings and enquiries. We respond within 24 hours."
};
const contactItems = [
  {
    title: "Enquiries and bookings",
    description: "Share your dates, room preference, and event needs. Our team responds within 24 hours.",
    action: { label: "Send an enquiry", href: "/enquiry" }
  },
  {
    title: "Location",
    description: "Quiet hillside location, about 10 minutes from the city center. Address shared upon confirmation.",
    note: "Add your exact address and map link here before launch."
  },
  {
    title: "Phone and WhatsApp",
    description: "Prefer to speak directly? Add your phone, WhatsApp, and email details here."
  }
];
function ContactPage() {
  return <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
          Contact
        </p>
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl lg:text-4xl font-display">
          We would love to plan your stay.
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
          For bookings and enquiries, the quickest way to reach us is through
          the enquiry form. We respond within 24 hours and can tailor rooms,
          dining, and event setups for your dates.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {contactItems.map((item) => <article
    key={item.title}
    className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40"
  >
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{item.description}</p>
            {item.note && <p className="mt-3 text-xs text-stone-500">{item.note}</p>}
            {item.action && <Link
    href={item.action.href}
    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 sm:w-auto"
  >
                {item.action.label}
              </Link>}
          </article>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900 font-display">
            Planning an event?
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            Our banquet and small hall are designed for weddings, corporate
            gatherings, and intimate celebrations. Tell us your guest count and
            preferred layout and we will share options quickly.
          </p>
          <Link
    href="/enquiry"
    className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
  >
            Send an event enquiry
          </Link>
        </div>

        <aside className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-6 text-sm text-emerald-900">
          <h2 className="text-base font-semibold text-emerald-900">
            Quick response promise
          </h2>
          <p className="mt-2 text-emerald-800">
            We usually reply within 24 hours. Include your dates and we will
            confirm room availability and pricing.
          </p>
          <Link
    href="/enquiry"
    className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
  >
            Send an enquiry
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 font-display">
            Send a message
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Prefer a quick note? Share your dates and we will respond with
            availability and pricing details.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-stone-600 shadow-md shadow-emerald-100/40">
          <h3 className="text-sm font-semibold text-stone-900">
            What we typically need
          </h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Preferred dates and guest count.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Room category or event needs.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Any special requests or timing.
            </li>
          </ul>
        </div>
      </section>
    </div>;
}
export default ContactPage;
export { metadata };
