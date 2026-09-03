import Image from "next/image";
import Link from "next/link";
import { dbClient as db } from "@/app/(shared)/lib/db-client";
import { HeroCarousel } from "./components/HeroCarousel";
import { FacilityCard } from "./components/FacilityCard";
import { facilities } from "./facilities/facility-data";
import { attachFacilityImages, listHeroImages } from "./lib/image-loader";
import { home, site } from "@/content/site-content";

export const runtime = "nodejs";
export const revalidate = 300;

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

function formatPrice(price: { toString: () => string }) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}

export default async function MarketingHomePage() {
  const now = new Date();
  const { data: activeOffersData } = await db
    .from('"Offer"')
    .select("id,title,description,price,validFrom,validTo,isActive")
    .eq("isActive", true)
    .lte("validFrom", now.toISOString())
    .gte("validTo", now.toISOString())
    .order("validTo", { ascending: true })
    .limit(6);
  const activeOffers = activeOffersData ?? [];
  const heroImages = await listHeroImages();
  const facilityCards = await attachFacilityImages(facilities);

  return (
    <div className="space-y-16">
      {/* Pull up to cancel the top padding on <main> so the banner sits flush
          under the header. */}
      <div className="-mt-8 sm:-mt-14">
        <HeroCarousel images={heroImages}>
          <div className="kv-hero-enter mx-auto max-w-4xl text-center text-white">
            {/* Eyebrow, set between hairlines rather than in a pill. */}
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-white/60 sm:w-14" />
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:text-xs">
                {home.hero.eyebrow}
              </p>
              <span className="h-px w-8 bg-white/60 sm:w-14" />
            </div>

            <h1 className="mt-7 text-balance font-display text-5xl font-normal leading-[1.12] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              {home.hero.title}
              <span className="block italic">{home.hero.titleAccent}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/95 [text-shadow:0_1px_14px_rgba(0,0,0,0.7)] sm:text-lg">
              {home.hero.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/enquiry"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
              >
                {home.hero.primaryCta.label}
              </Link>
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20"
              >
                {home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </HeroCarousel>
      </div>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
            {home.intro.eyebrow}
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            {home.intro.eyebrowNote}
          </p>
          <h1 className="text-balance font-display text-5xl font-normal tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            {home.intro.title}{" "}
            <span className="font-forte bg-gradient-to-r from-amber-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              {site.name}
            </span>
            .
          </h1>
          <p className="max-w-xl text-balance text-base text-stone-600 sm:text-lg">
            {home.intro.storyBefore}{" "}
            <span className="font-forte">{site.name}</span>
            {home.intro.storyAfter}
            <br />
            <br />
            {home.intro.storySecond}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {home.intro.primaryCta.label}
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {home.intro.secondaryCta.label}
            </Link>
          </div>
          <dl className="mt-4 grid gap-4 text-sm text-stone-600 sm:grid-cols-3">
            {home.intro.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  {stat.label}
                </dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-40 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="kv-hero-frame relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/60">
            <Image
              src="/hero-hotel.jpg"
              alt="Elegant hotel lobby illustration"
              width={720}
              height={520}
              // className="kv-hero-illustration h-72 w-full object-cover sm:h-80"
              priority
            />
            <div className="space-y-3 border-t border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
                {home.photoCaption.eyebrow}
              </p>
              <p className="text-sm text-stone-700">
                {home.photoCaption.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
            {home.facilitiesSection.title}
          </h2>
          <p className="text-sm text-stone-600">
            {home.facilitiesSection.description}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilityCards.map((facility) => (
            <FacilityCard key={facility.slug} facility={facility} />
          ))}
          {/* Rooms is not a facility, but it belongs in this row. */}
          <FacilityCard
            facility={{
              slug: "rooms",
              href: "/rooms",
              title: home.facilitiesSection.roomsCard.title,
              badge: home.facilitiesSection.roomsCard.badge,
              description: home.facilitiesSection.roomsCard.description,
              images: ["/hero-hotel.jpg"],
            }}
          />
        </div>
      </section>

      <section className="kv-themed-section grid gap-8 rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
            {home.experiencesSection.title}
          </h2>
          <p className="text-sm text-stone-600">
            {home.experiencesSection.description}
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            {home.experiencesSection.moments.map((moment) => (
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
            <h2 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
              Room categories
            </h2>
            <p className="text-sm text-stone-600">
              {home.roomsSection.description}
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
                <h3 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
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

      <section className="kv-themed-section space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
              Current offers
            </h2>
            <p className="text-sm text-stone-600">
              {home.offersSection.description}
            </p>
          </div>
          <Link
            href="/offers"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
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
                  <h3 className="font-sans text-lg font-medium leading-snug tracking-[-0.005em] text-stone-900">
                    {offer.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-stone-600">
                    {offer.description}
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
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
            {home.offersSection.emptyBefore}{" "}
            <Link
              href="/enquiry"
              className="font-medium text-emerald-700 hover:text-emerald-600"
            >
              {home.offersSection.emptyLinkLabel}
            </Link>{" "}
            {home.offersSection.emptyAfter}
          </p>
        )}
      </section>
    </div>
  );
}

