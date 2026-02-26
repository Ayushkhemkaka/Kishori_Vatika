import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/(shared)/lib/db";
import { roomCategories } from "./rooms/room-data";
import { facilities } from "./facilities/facility-data";
import { ImageCarousel } from "./components/ImageCarousel";
export const runtime = "nodejs";
export const revalidate = 300;
const signatureMoments = [
  "Tea service on the terrace",
  "Curated breakfast spreads",
  "Evening poolside calm",
  "Personalized event planning"
];
function formatPrice(price) {
  const n = Number(price);
  return Number.isNaN(n) ? price.toString() : `INR ${n.toLocaleString("en-IN")}`;
}
async function MarketingHomePage() {
  const now = /* @__PURE__ */ new Date();
  const activeOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validTo: { gte: now }
    },
    select: { id: true, title: true, description: true, price: true, validFrom: true, validTo: true, isActive: true },
    orderBy: { validTo: "asc" },
    take: 6
  });
  return <div className="space-y-16">
      <section className="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:items-center">
        <div className="space-y-6 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-800">
            Resorts & Restaurant
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            Book now
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl font-display">
            A refined stay at{" "}
            <span className="font-forte bg-gradient-to-r from-amber-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              KiSHORi VATiKA
            </span>
            .
          </h1>
          <p className="mx-auto max-w-none text-balance text-base text-stone-600 sm:mx-0 sm:text-lg">
           Welcome to KiSHORi VATiKA, a perfect destination where comfort, celebration, and nature 
           come together. Our resort offers spacious rooms, modern amenities, a beautiful lawn, a 
           swimming pool, lush surroundings, and warm hospitality to make every stay memorable. 
           Whether you are planning a relaxing family getaway, a grand wedding, or a special 
           celebration, Kishori Vatika provides the ideal setting with elegant venues, delicious 
           dining, and personalized service.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
    href="/enquiry"
    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500 sm:w-auto"
  >
              Check availability
            </Link>
            <Link
    href="/offers"
    className="inline-flex w-full items-center justify-center rounded-full border border-emerald-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:text-emerald-700 sm:w-auto"
  >
              View current offers
            </Link>
          </div>
          <dl className="mt-4 grid w-full max-w-3xl gap-4 text-sm text-stone-600 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Check-in / Check-out
              </dt>
              <dd>12:00 pm - 10:00 am</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Rooms inventory
              </dt>
              <dd>Rooms</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Event spaces
              </dt>
              <dd>1 banquet, 1 small hall, 1 lawn</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-40 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/60">
            <Image
    src="/hero-hotel.jpg"
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
        <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
            Facilities at a glance
            </h2>
            <p className="text-sm text-stone-600">
              Everything you need for stays, dining, and celebrations in one
              thoughtfully designed property.
            </p>
          </div>
          <Link
            href="/facilities"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
          >
            Explore all facilities &rarr;
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => <article
    key={facility.slug}
    className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40 transition hover:border-emerald-200 hover:shadow-emerald-100/70"
  >
              <Link href={`/facilities#${facility.slug}`} className="block space-y-3">
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                  {facility.badge}
                </span>
                <div className="space-y-2">
                  <ImageCarousel
                    images={facility.images}
                    title={facility.title}
                    className="h-40 w-full object-cover"
                    containerClassName="rounded-xl border border-emerald-100 bg-stone-100/70"
                  />
                </div>
                <h3 className="text-base font-semibold text-stone-900 font-display">
                  {facility.title}
                </h3>
                <p className="text-sm text-stone-600">{facility.description}</p>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700">Timing</span>
                    <span className="text-sm font-semibold text-emerald-900">
                      {facility.timing}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1">
                    <span>{facility.bestFor}</span>
                    <span>{facility.capacity}</span>
                    <span>{facility.access}</span>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-stone-500">
                  {facility.highlights.slice(0, 3).map((item) => <li key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {item}
                    </li>)}
                </ul>
              </Link>
              <div className="mt-5 flex items-center justify-between text-xs text-stone-500">
                <span>Events and stay support available</span>
                <Link
                  href={`/facilities#${facility.slug}`}
                  className="text-emerald-700 group-hover:text-emerald-600"
                >
                  View details
                </Link>
              </div>
            </article>)}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
            Signature experiences
          </h2>
          <p className="text-sm text-stone-600">
            A resort atmosphere with warm hospitality, calm interiors,
            and events designed with care.
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            {signatureMoments.map((moment) => <li key={moment} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {moment}
              </li>)}
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
        <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl font-display">
              Room categories
            </h2>
            <p className="text-sm text-stone-600">
              Five categories designed for couples, families, and business stays.
            </p>
          </div>
          <Link
    href="/rooms"
    className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
  >
            Explore all rooms &rarr;
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {roomCategories.map((room) => <article
    key={room.title}
    className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-md shadow-emerald-100/40 transition hover:border-emerald-200 hover:shadow-emerald-100/70"
  >
              <Link href={`/rooms#${room.slug}`} className="block space-y-3">
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                  {room.badge}
                </span>
                <div className="space-y-2">
                  <ImageCarousel
                    images={room.images}
                    title={room.title}
                    className="h-40 w-full object-cover"
                    containerClassName="rounded-xl border border-emerald-100 bg-stone-100/70"
                  />
                </div>
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
                  {room.perks.map((perk) => <li key={perk} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {perk}
                    </li>)}
                </ul>
              </Link>
              <div className="mt-5 flex items-center justify-between text-xs text-stone-500">
                <span>Breakfast and Wi-Fi included</span>
                <Link
    href={`/rooms#${room.slug}`}
    className="text-emerald-700 group-hover:text-emerald-600"
  >
                  View details
                </Link>
              </div>
            </article>)}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/80 p-6 sm:p-8">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
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
        {activeOffers.length > 0 ? <div className="grid gap-4 md:grid-cols-2">
            {activeOffers.map((offer) => <article
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
              </article>)}
          </div> : <p className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm text-stone-600">
            No active offers at the moment. Check back soon or{" "}
            <Link
    href="/enquiry"
    className="font-medium text-emerald-700 hover:text-emerald-600"
  >
              send an enquiry
            </Link>{" "}
            and we will tailor something for your dates.
          </p>}
      </section>
    </div>;
}
export default MarketingHomePage;
