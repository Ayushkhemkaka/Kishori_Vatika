import Image from "next/image";
import Link from "next/link";
import { dbClient as db } from "@/app/(shared)/lib/db-client";
import { fetchReviews } from "@/app/(shared)/lib/google-reviews";
import { HeroCarousel } from "./components/HeroCarousel";
import { ImageCarousel } from "./components/ImageCarousel";
import { PhotoCycle } from "./components/PhotoCycle";
import { SpecIcon } from "./components/SpecIcon";
import { Reveal } from "./components/Reveal";
import { LocationMap } from "./components/LocationMap";
import { GoogleReviews } from "./components/GoogleReviews";
import { FacilityCard } from "./components/FacilityCard";
import { facilities } from "./facilities/facility-data";
import { roomCategories } from "./rooms/room-data";
import {
  attachFacilityImages,
  attachRoomImages,
  listHeroImages,
  listShowcaseImages,
} from "./lib/image-loader";
import { home, site } from "@/content/site-content";

export const runtime = "nodejs";
export const revalidate = 300;

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
  const roomCards = await attachRoomImages(roomCategories);
  const showcaseImages = await listShowcaseImages();
  const googleReviews = await fetchReviews();

  return (
    <div className="space-y-10">
      {/* Pull up to cancel the top padding on <main> so the banner sits flush
          under the header. */}
      <div className="-mt-5 sm:-mt-7">
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

            <h1 className="mt-5 text-balance font-accent text-5xl font-normal leading-[1.05] [text-shadow:0_2px_24px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              {home.hero.title}
              <span className="block italic">{home.hero.titleAccent}</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-white/95 [text-shadow:0_1px_14px_rgba(0,0,0,0.7)] sm:text-lg">
              {home.hero.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/enquiry"
                className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
              >
                {home.hero.primaryCta.label}
              </Link>
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center rounded-sm border border-white/70 bg-white/10 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20"
              >
                {home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </HeroCarousel>
      </div>

      <Reveal>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
              {home.intro.eyebrow}
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              {home.intro.eyebrowNote}
            </p>
            <h1 className="text-balance font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
              {home.intro.title}{" "}
              <span className="font-forte kv-wordmark">
                {site.name}
              </span>
              .
            </h1>
            {/* No clamp of its own: the story shares the column with the
                heading above it, so both wrap on the same edge. `text-balance`
                belongs on the heading only - on a paragraph it evens the lines
                out and breaks them short of the measure. */}
            <div className="kv-quote space-y-3 text-base text-stone-600 sm:text-lg">
              <p>
                {home.intro.storyBefore}{" "}
                <span className="font-forte">{site.name}</span>
                {home.intro.storyAfter}
              </p>
              <p>{home.intro.storySecond}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/enquiry"
                className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
              >
                {home.intro.primaryCta.label}
              </Link>
              <Link
                href="/offers"
                className="inline-flex items-center justify-center rounded-sm border border-emerald-200 bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                {home.intro.secondaryCta.label}
              </Link>
            </div>
            <dl className="mt-3 grid gap-4 text-sm text-stone-600 sm:grid-cols-3">
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
            <div className="kv-hero-frame relative overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-xl shadow-emerald-100/60">
              {/* Cycles through public/Photo/ rather than sitting on one shot;
                  the carousel owns the box height so a portrait frame cannot
                  resize the card. */}
              <ImageCarousel
                images={showcaseImages}
                title={site.name}
                containerClassName="h-72 sm:h-80 lg:h-[26rem]"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <div className="space-y-2 border-t border-emerald-100 bg-emerald-50/60 p-4">
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
      </Reveal>

      <Reveal>
        <section className="space-y-5">
            <div>
              <h2 className="font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
                {home.facilitiesSection.title}
              </h2>
              <p className="text-sm text-stone-600">
                {home.facilitiesSection.description}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {facilityCards.map((facility, index) => (
                <FacilityCard
                  key={facility.slug}
                  facility={facility}
                  index={index}
                />
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
      </Reveal>

      <Reveal>
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
                Room categories
              </h2>
              <p className="text-sm text-stone-600">
                {home.roomsSection.description}
              </p>
            </div>
            <Link
              href="/offers"
              className="kv-underline text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-600"
            >
              Explore current offers &rarr;
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roomCards.map((room, index) => (
              <article
                key={room.slug}
                className="kv-lift group flex flex-col justify-between overflow-hidden rounded-md border border-emerald-100 bg-white shadow-md shadow-emerald-100/40 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/70"
              >
                <div>
                  {/* Cover photo, first file in public/rooms/<slug>/. The box is
                      fixed by its aspect ratio so a portrait shot cannot stretch
                      the card. */}
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-emerald-50"
                  >
                    <PhotoCycle
                      images={room.images ?? []}
                      alt={room.title}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      offsetMs={index * 900}
                      className="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-sm bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800 backdrop-blur">
                      {room.badge}
                    </span>
                  </Link>

                  <div className="space-y-4 px-5 pb-3 pt-5">
                    <div className="space-y-1.5">
                      <h3 className="font-display text-xl font-medium tracking-tight text-stone-900">
                        <Link href={`/rooms/${room.slug}`} className="kv-underline transition-colors hover:text-emerald-700">
                          {room.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-stone-600">{room.description}</p>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-stone-700">
                      {[room.bed, room.occupancy, room.size].map((spec: string) => (
                        <li key={spec} className="flex items-center gap-2">
                          <SpecIcon label={spec} className="h-[18px] w-[18px] shrink-0 text-emerald-700" />
                          <span className="truncate" title={spec}>
                            {spec}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <ul className="flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                      {room.perks.map((perk: string) => (
                        <li
                          key={perk}
                          className="rounded-sm border border-emerald-100 bg-emerald-50/60 px-2.5 py-1"
                        >
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 px-5 pb-5">
                  <div className="flex items-end justify-between gap-3 border-t border-emerald-100 pt-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        From
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-stone-900">
                        {room.price}
                      </p>
                    </div>
                    <Link
                      href={`/rooms/${room.slug}`}
                      className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 group-hover:text-emerald-600"
                    >
                      {home.roomsSection.cardCta} &rarr;
                    </Link>
                  </div>
                  <p className="text-xs text-stone-500">{home.roomsSection.inclusionNote}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Two subjects, two cards: where we are, and what the stay is like.
          They sat in one frame before, which read as a single claim. */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal className="h-full">
          <div className="kv-themed-section h-full space-y-3 rounded-lg border border-emerald-100 bg-white p-5 sm:p-7">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {home.locationSection.title}
            </h2>
            <LocationMap />
            <p className="text-sm text-stone-600">
              {home.locationSection.description}
            </p>
          </div>
        </Reveal>

          {/* The map makes the left column the taller of the two. Rather than
              centre a short block against it and leave a band of space top and
              bottom, the moments are hairline-separated rows that share the
              slack between them - no extra boxes inside a box. */}
          <Reveal delay={130} className="h-full">
          <div className="kv-themed-section flex h-full flex-col gap-4 rounded-lg border border-emerald-100 bg-white p-5 sm:p-7">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
                {home.experiencesSection.title}
              </h2>
              <p className="text-sm text-stone-600">
                {home.experiencesSection.description}
              </p>
            </div>

            <ul className="flex flex-1 flex-col divide-y divide-emerald-100 border-y border-emerald-100">
              {home.experiencesSection.moments.map((moment) => (
                <li
                  key={moment}
                  className="flex flex-1 items-center gap-3.5 py-3 text-sm text-stone-700"
                >
                  <SpecIcon label={moment} className="h-5 w-5 shrink-0 text-emerald-700" />
                  {moment}
                </li>
              ))}
            </ul>

            <Link
              href={home.experiencesSection.contactCta.href}
              className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-600"
            >
              <span className="kv-underline">{home.experiencesSection.contactCta.label}</span>
            <span className="kv-nudge">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section>
          <GoogleReviews
            initial={googleReviews}
            browserKey={process.env.GOOGLE_MAPS_API_KEY}
            placeId={process.env.GOOGLE_PLACE_ID}
          />
        </section>
      </Reveal>

      <Reveal>
        <section className="kv-themed-section space-y-5 rounded-lg border border-emerald-100 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
                Current offers
              </h2>
              <p className="text-sm text-stone-600">
                {home.offersSection.description}
              </p>
            </div>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-sm bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              See all offers
            </Link>
          </div>
          {activeOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeOffers.map((offer) => (
                <article
                  key={offer.id}
                  className="group flex flex-col justify-between rounded-md border border-emerald-100 bg-white p-4 transition hover:border-emerald-200"
                >
                  <div className="space-y-2">
                    <span className="inline-flex rounded-sm bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                      Limited time
                    </span>
                    <h3 className="font-display text-xl font-medium tracking-tight text-stone-900">
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
            <p className="rounded-md border border-emerald-100 bg-white p-4 text-sm text-stone-600">
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
      </Reveal>
    </div>
  );
}

