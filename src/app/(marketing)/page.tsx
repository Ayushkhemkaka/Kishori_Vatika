import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const roomCategories = [
  {
    title: "Deluxe Room",
    description: "Quiet garden views with warm, understated interiors.",
    badge: "Comfort choice",
    price: "INR 2,800",
    occupancy: "Up to 2 guests",
    size: "220 sq ft",
    bed: "Queen bed",
    perks: ["Garden-facing", "Work desk", "Rain shower"],
  },
  {
    title: "Premium Room",
    description: "More space with a balcony and lounge seating.",
    badge: "Most booked",
    price: "INR 3,600",
    occupancy: "Up to 3 guests",
    size: "280 sq ft",
    bed: "King bed",
    perks: ["Private balcony", "Lounge chair", "Premium linens"],
  },
  {
    title: "Executive Room",
    description: "Refined finishes with elevated amenities for longer stays.",
    badge: "Business ready",
    price: "INR 4,200",
    occupancy: "Up to 3 guests",
    size: "320 sq ft",
    bed: "King bed",
    perks: ["Minibar", "Ergonomic desk", "Evening turndown"],
  },
  {
    title: "Family Room",
    description: "Flexible layout for families with extra storage.",
    badge: "Family favorite",
    price: "INR 4,800",
    occupancy: "Up to 4 guests",
    size: "360 sq ft",
    bed: "King + twin",
    perks: ["Extra bedding", "Kids amenities", "Pantry access"],
  },
  {
    title: "Signature Suite",
    description: "Separate living area with signature decor and privacy.",
    badge: "Signature stay",
    price: "INR 6,500",
    occupancy: "Up to 4 guests",
    size: "520 sq ft",
    bed: "King bed",
    perks: ["Living area", "Premium bath", "Priority dining"],
  },
];

const featureHighlights = [
  {
    title: "Restaurant",
    description: "All-day dining with seasonal menus and local favorites.",
  },
  {
    title: "Swimming Pool",
    description: "A calm pool deck for morning laps and evening rest.",
  },
  {
    title: "Banquet",
    description: "One elegant banquet space for weddings and celebrations.",
  },
  {
    title: "Small Hall",
    description: "Ideal for meetings, private dinners, or intimate events.",
  },
  {
    title: "20 Rooms",
    description: "A boutique inventory for attentive, personalized service.",
  },
];

const signatureMoments = [
  "Tea service on the terrace",
  "Curated breakfast spreads",
  "Evening poolside calm",
  "Personalized event planning",
];

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}

export default async function MarketingHomePage() {
  const now = new Date();
  const { data: activeOffersData } = await supabase
    .from('"Offer"')
    .select("id,title,description,price,validFrom,validTo,isActive")
    .eq("isActive", true)
    .lte("validFrom", now.toISOString())
    .gte("validTo", now.toISOString())
    .order("validTo", { ascending: true })
    .limit(6);
  const activeOffers = activeOffersData ?? [];

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-800">
            Hotel and events
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            Now booking
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl font-display">
            A refined stay at{" "}
            <span className="bg-gradient-to-r from-amber-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              Kishori Vatika
            </span>
            .
          </h1>
          <p className="max-w-xl text-balance text-base text-stone-600 sm:text-lg">
            A boutique hotel with 20 rooms, five room categories, and inviting
            spaces for dining, celebrations, and quiet retreats. Thoughtful
            service, elegant interiors, and the calm you expect from a proper
            hotel experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
            >
              Check availability
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              View current offers
            </Link>
          </div>
          <dl className="mt-4 grid gap-4 text-sm text-stone-600 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Check-in / Check-out
              </dt>
              <dd>2:00 pm - 11:00 am</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Rooms inventory
              </dt>
              <dd>20 rooms across five categories</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Event spaces
              </dt>
              <dd>1 banquet, 1 small hall</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-40 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/60">
            <Image
              src="/hero-hotel.svg"
              alt="Elegant hotel lobby illustration"
              width={720}
              height={520}
              className="h-72 w-full object-cover sm:h-80"
              priority
            />
            <div className="space-y-3 border-t border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
                Stay the Kishori way
              </p>
              <p className="text-sm text-stone-700">
                Morning coffee, warm light, and a quiet pool deck set the pace
                for a refined, restful stay.
              </p>
              <p className="text-xs text-stone-500">
                "Elegant rooms, attentive staff, and beautiful event spaces." -
                recent guest
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
            Facilities at a glance
          </h2>
          <p className="text-sm text-stone-600">
            Everything you need for stays, dining, and celebrations in one
            thoughtfully designed property.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featureHighlights.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-stone-700 shadow-md shadow-emerald-100/50"
            >
              <h3 className="text-base font-semibold text-stone-900 font-display">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
            Signature experiences
          </h2>
          <p className="text-sm text-stone-600">
            A boutique hotel atmosphere with warm hospitality, calm interiors,
            and events designed with care.
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            {signatureMoments.map((moment) => (
              <li key={moment} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {moment}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-600"
          >
            Speak with our team &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              Restaurant
            </p>
            <p className="mt-2 text-sm text-stone-700">
              Seasonal menus, private dining, and curated tasting evenings.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              Events
            </p>
            <p className="mt-2 text-sm text-stone-700">
              Host weddings, conferences, and family celebrations with ease.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              Pool deck
            </p>
            <p className="mt-2 text-sm text-stone-700">
              A serene pool setting with loungers and evening ambience.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              Service
            </p>
            <p className="mt-2 text-sm text-stone-700">
              Attentive concierge, curated itineraries, and flexible requests.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
              Room categories
            </h2>
            <p className="text-sm text-stone-600">
              Five categories designed for couples, families, and business stays.
            </p>
          </div>
          <Link
            href="/offers"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
          >
            Explore current offers &rarr;
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {roomCategories.map((room) => (
            <article
              key={room.title}
              className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40 transition hover:border-emerald-200 hover:shadow-emerald-100/70"
            >
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                  {room.badge}
                </span>
                <h3 className="text-base font-semibold text-stone-900 font-display">
                  {room.title}
                </h3>
                <p className="text-sm text-stone-600">{room.description}</p>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700">From</span>
                    <span className="text-sm font-semibold text-emerald-900">
                      {room.price}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1">
                    <span>{room.occupancy}</span>
                    <span>{room.size}</span>
                    <span>{room.bed}</span>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-stone-500">
                  {room.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-stone-500">
                <span>Breakfast and Wi-Fi included</span>
                <Link
                  href="/enquiry"
                  className="text-emerald-700 group-hover:text-emerald-600"
                >
                  Enquire
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/80 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
              Current offers
            </h2>
            <p className="text-sm text-stone-600">
              Curated stays with thoughtful extras included.
            </p>
          </div>
          <Link
            href="/offers"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
          >
            See all offers
          </Link>
        </div>
        {activeOffers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeOffers.map((offer) => (
              <article
                key={offer.id}
                className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-4 transition hover:border-emerald-200"
              >
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                    Limited time
                  </span>
                  <h3 className="text-base font-semibold text-stone-900 font-display">
                    {offer.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-stone-600">
                    {offer.description}
                  </p>
                </div>
                <div className="mt-3 flex justify-between text-xs text-stone-500">
                  <span>
                    From {formatPrice(offer.price)} - Breakfast, Wi-Fi, and taxes
                    included.
                  </span>
                  <Link
                    href={`/offers/${offer.id}`}
                    className="font-medium text-emerald-700 hover:text-emerald-600"
                  >
                    View &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm text-stone-600">
            No active offers at the moment. Check back soon or{" "}
            <Link
              href="/enquiry"
              className="font-medium text-emerald-700 hover:text-emerald-600"
            >
              send an enquiry
            </Link>{" "}
            and we will tailor something for your dates.
          </p>
        )}
      </section>
    </div>
  );
}
