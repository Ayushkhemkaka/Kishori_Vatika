import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roomCategories, getRoomBySlug } from "../room-data";
import { ImageCarousel } from "../../components/ImageCarousel";
import { attachRoomImages } from "../../lib/image-loader";
import { roomsPage } from "@/content/site-content";

export const runtime = "nodejs";

// The room list is static, so every detail page can be built ahead of time.
export function generateStaticParams() {
  return roomCategories.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return { title: "Room" };
  return {
    title: room.title,
    description: room.longDescription ?? room.description,
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  // Photos come from public/rooms/<slug>/, so images can be added by dropping
  // files into the folder with no code change.
  const [withImages] = await attachRoomImages([room]);
  const images = withImages.images ?? [];

  const others = roomCategories.filter((other) => other.slug !== slug);

  return (
    <div className="space-y-7">
      {/* The list is one step back, so a back link says it more plainly than
          a breadcrumb trail that would only repeat the title below it. */}
      <nav>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500 transition hover:text-emerald-700"
        >
          <span aria-hidden>&larr;</span>
          {roomsPage.detail.breadcrumb}
        </Link>
      </nav>

      {/* Photo first, sized to what is left of the viewport, so the whole
          frame is in view on landing with the detail below hinting at more.
          The name and the line about the room ride on the photo instead of
          stacking above it, which is what pushed the image off-screen. */}
      <header className="relative overflow-hidden rounded-3xl border border-emerald-100">
        <ImageCarousel
          images={images}
          title={room.title}
          containerClassName="h-[min(calc(100svh-13rem),640px)] min-h-[300px]"
          counterClassName="right-4 top-4"
          sizes="(min-width: 1024px) 90vw, 100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
          {room.badge ? (
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {room.badge}
            </span>
          ) : null}
          <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
            {room.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            {room.longDescription ?? room.description}
          </p>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-stone-700 sm:grid-cols-4">
            {[
              [roomsPage.detail.specLabels.price, room.price],
              [roomsPage.detail.specLabels.occupancy, room.occupancy],
              [roomsPage.detail.specLabels.size, room.size],
              [roomsPage.detail.specLabels.bed, room.bed],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-700">
                  {label}
                </p>
                <p className="mt-1.5">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {roomsPage.detail.highlightsTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {room.perks.map((item: string) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {roomsPage.detail.amenitiesTitle}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
              {(room.amenities ?? []).map((item: string) => (
                <li
                  key={item}
                  className="rounded-full border border-emerald-100 bg-emerald-50/60 px-3.5 py-1.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-emerald-200/60 bg-emerald-50 p-6">
          <h2 className="font-sans text-lg font-medium text-emerald-900">
            {roomsPage.detail.asideTitle}
          </h2>
          <p className="text-sm leading-relaxed text-emerald-800">
            {roomsPage.detail.asideDescription}
          </p>
          <div className="flex flex-col gap-3 pt-1">
            <Link
              href={roomsPage.detail.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
            >
              {roomsPage.detail.primaryCta.label}
            </Link>
            <Link
              href={roomsPage.detail.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {roomsPage.detail.secondaryCta.label}
            </Link>
          </div>
        </aside>
      </section>

      <section className="space-y-4 border-t border-emerald-100 pt-6">
        <h2 className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-3xl">
          {roomsPage.detail.otherTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/rooms/${other.slug}`}
              className="group rounded-2xl border border-emerald-100 bg-white p-4 transition hover:border-emerald-300"
            >
              <h3 className="font-sans text-base font-medium text-stone-900">
                {other.title}
              </h3>
              <p className="mt-1.5 text-sm text-stone-600">
                {other.description}
              </p>
              <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                {roomsPage.detail.viewLabel} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
