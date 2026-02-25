export const roomCategories = [
  {
    slug: "classic-room",
    title: "Classic Room",
    description: "Quiet garden views with warm, understated interiors.",
    longDescription:
      "A calm and cozy option for short stays with natural light, practical workspace, and all core comforts.",
    badge: "Comfort choice",
    images: ["/hero-hotel.jpg", "/hero-hotel.jpg", "/hero-hotel.jpg"],
    price: "INR 2,800",
    occupancy: "Up to 2 guests",
    size: "220 sq ft",
    bed: "Queen bed",
    perks: ["Garden-facing", "Work desk", "Rain shower"],
    amenities: ["Wi-Fi", "Air conditioning", "Tea/coffee setup", "Room service"],
  },
  {
    slug: "deluxe-room",
    title: "Deluxe Room",
    description: "More space with a balcony and lounge seating.",
    longDescription:
      "A spacious room category with balcony comfort, ideal for guests who prefer longer, relaxed stays.",
    badge: "Most booked",
    images: ["/hero-hotel.jpg", "/hero-hotel.jpg", "/hero-hotel.jpg"],
    price: "INR 3,600",
    occupancy: "Up to 3 guests",
    size: "280 sq ft",
    bed: "King bed",
    perks: ["Private balcony", "Lounge chair", "Premium linens"],
    amenities: ["Wi-Fi", "Air conditioning", "Mini fridge", "In-room dining"],
  },
  {
    slug: "executive-room",
    title: "Executive Room",
    description: "Refined finishes with elevated amenities for longer stays.",
    longDescription:
      "Designed for guests who need extra productivity and comfort, with premium details and quiet ambience.",
    badge: "Business ready",
    images: ["/hero-hotel.jpg", "/hero-hotel.jpg", "/hero-hotel.jpg"],
    price: "INR 4,200",
    occupancy: "Up to 3 guests",
    size: "320 sq ft",
    bed: "King bed",
    perks: ["Minibar", "Ergonomic desk", "Evening turndown"],
    amenities: ["Wi-Fi", "Air conditioning", "Executive desk", "Laundry support"],
  },
  {
    slug: "suite",
    title: "Suite",
    description: "Flexible layout for families with extra storage.",
    longDescription:
      "Comfortably suited for families and small groups with larger layout, storage, and flexible bedding setup.",
    badge: "Family favorite",
    images: ["/hero-hotel.jpg", "/hero-hotel.jpg", "/hero-hotel.jpg"],
    price: "INR 4,800",
    occupancy: "Up to 4 guests",
    size: "360 sq ft",
    bed: "King + twin",
    perks: ["Extra bedding", "Kids amenities", "Pantry access"],
    amenities: ["Wi-Fi", "Air conditioning", "Family seating", "On-call support"],
  },
  {
    slug: "executive-suite",
    title: "Executive Suite",
    description: "Separate living area with signature decor and privacy.",
    longDescription:
      "Our premium category with spacious living zone, enhanced privacy, and elevated in-room experience.",
    badge: "Signature stay",
    images: ["/hero-hotel.jpg", "/hero-hotel.jpg", "/hero-hotel.jpg"],
    price: "INR 6,500",
    occupancy: "Up to 4 guests",
    size: "520 sq ft",
    bed: "King bed",
    perks: ["Living area", "Premium bath", "Priority dining"],
    amenities: ["Wi-Fi", "Air conditioning", "Premium toiletries", "Priority assistance"],
  },
];

export function getRoomBySlug(slug) {
  return roomCategories.find((room) => room.slug === slug);
}
