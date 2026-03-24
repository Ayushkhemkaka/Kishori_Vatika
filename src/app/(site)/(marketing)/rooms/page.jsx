import Link from "next/link";
import { roomCategories } from "./room-data";
import { ImageCarousel } from "../components/ImageCarousel";
import { attachRoomImages } from "../lib/image-loader";

export const metadata = {
  title: "Rooms",
  description: "Explore all room categories with photos, amenities, and stay details.",
};

export default async function RoomsPage() {
  const roomsWithImages = await attachRoomImages(roomCategories);
  return (
    <div className="space-y-10">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">Rooms</p>
        <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl font-display">
          Room categories at <span className="font-forte">KiSHORi VATiKA</span>
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">
          Browse each room category with detailed specs, amenities, and larger photo sections.
        </p>
      </header>

      <div className="space-y-10">
        {roomsWithImages.map((room) => (
          <section
            key={room.slug}
            id={room.slug}
            className="scroll-mt-24 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <ImageCarousel
              images={room.images}
              title={room.title}
              className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />

            <div className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-6">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                {room.badge}
              </span>
              <h2 className="text-3xl font-semibold text-stone-900 font-display">{room.title}</h2>
              <p className="text-sm text-stone-600 sm:text-base">{room.longDescription}</p>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-stone-700">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">From</p>
                  <p className="mt-1 font-semibold text-stone-900">{room.price}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Occupancy</p>
                  <p className="mt-1">{room.occupancy}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Room size</p>
                  <p className="mt-1">{room.size}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Bed type</p>
                  <p className="mt-1">{room.bed}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Room highlights</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  {room.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Amenities</h3>
                <ul className="mt-2 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  {(room.amenities ?? []).map((item) => (
                    <li key={item} className="rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/enquiry"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Enquire for this room
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:border-emerald-300"
                >
                  Talk to team
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
