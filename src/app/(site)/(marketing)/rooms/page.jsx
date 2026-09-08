import { roomCategories } from "./room-data";
import { CatalogueCard } from "../components/CatalogueCard";
import { Reveal } from "../components/Reveal";
import { attachRoomImages } from "../lib/image-loader";
import { roomsPage, site } from "@/content/site-content";

export const metadata = roomsPage.meta;

export default async function RoomsPage() {
  const roomsWithImages = await attachRoomImages(roomCategories);
  return (
    <div className="space-y-6">
      <Reveal>
        <header className="space-y-2 text-center sm:text-left">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">{roomsPage.header.eyebrow}</p>
        <h1 className="font-display text-3xl font-normal text-stone-900 sm:text-4xl lg:text-5xl">
          {roomsPage.header.title}{" "}
          <span className="font-forte">{site.name}</span>
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">
          {roomsPage.header.description}
        </p>
        </header>
      </Reveal>

      <div className="space-y-6">
        {roomsWithImages.map((room, index) => (
          <Reveal key={room.slug} delay={index * 90} className="scroll-mt-24">
            <CatalogueCard
              href={`/rooms/${room.slug}`}
              title={room.title}
              description={room.longDescription ?? room.description}
              badge={room.badge}
              images={room.images}
              // Bed, guests and size are what a visitor compares first; the
              // rest of the row is filled from the amenity list so the card
              // still shows six specs without repeating the detail page.
              specs={[room.bed, room.occupancy, room.size, ...(room.amenities ?? []).slice(0, 3)].filter(Boolean)}
              tags={(room.perks ?? []).slice(0, 4)}
              footerLabel={roomsPage.list.rateLabel}
              footerValue={room.price}
              ctaLabel={roomsPage.list.ctaLabel}
              flip={index % 2 === 1}
              index={index}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
