/**
 * Every piece of page copy on the public site lives here.
 *
 * Pages import from this file and render the values; they should not hold
 * literal sentences of their own. To reword the site, edit this file only -
 * no JSX changes required.
 *
 * Domain content that already has its own module stays where it is:
 *   - Facilities -> src/app/(site)/(marketing)/facilities/facility-data.js
 *   - Rooms      -> src/app/(site)/(marketing)/rooms/room-data.js
 */

export type PageHeader = {
  /** Small tracked label above the title. */
  eyebrow: string;
  title: string;
  /** Intro paragraph under the title. */
  description?: string;
};

export type Cta = { label: string; href: string };

export type TitledItem = { title: string; description: string };

/* ------------------------------------------------------------------ site */

export const site = {
  name: "KiSHORi VATiKA",
  role: "Resort - Since 2024",
  location: "Ramnagar · West Champaran",
  responseTime: "We respond within 24 hours.",
};

/* ------------------------------------------------------------------ home */

export const home = {
  hero: {
    eyebrow: site.location,
    title: "Where greenery hosts your grandest celebrations",
    titleAccent: "and your quietest escapes",
    description:
      "A garden resort for weddings, gatherings, and unhurried mornings.",
    primaryCta: { label: "Check availability", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Explore rooms", href: "/rooms" } as Cta,
  },

  intro: {
    eyebrow: "Resorts & Restaurant",
    eyebrowNote: "Now booking",
    title: "A refined stay at",
    // Split around the brand name, which is set in the display face.
    storyBefore:
      "\"In the heart of rural West Champaran, where no resort had ever stood, we planted a dream in 2022. A garden where celebration and stillness could live side by side. We named it",
    storyAfter:
      ", because like Kishori, true beauty doesn't shout. It blooms quietly, and those who arrive, simply know.",
    storySecond:
      "Today, this garden hosts grand shaadis and silent mornings alike. And just like its name, it stays forever fresh, forever welcoming.\"",
    primaryCta: { label: "Check availability", href: "/enquiry" } as Cta,
    secondaryCta: { label: "View current offers", href: "/offers" } as Cta,
    stats: [
      { label: "Check-in / Check-out", value: "12:00 pm - 10:00 am" },
      { label: "Rooms inventory", value: "20 rooms" },
      { label: "Event spaces", value: "1 banquet, 1 small hall, 1 lawn" },
    ],
  },

  facilitiesSection: {
    title: "Facilities at a glance",
    description:
      "Stay, swim, dine, celebrate. Everything under one roof, surrounded by green",
    roomsCard: {
      title: "Rooms",
      badge: "Stay",
      description: "A boutique inventory for attentive, personalized service.",
    },
  },

  experiencesSection: {
    title: "Signature experiences",
    description:
      "A resort atmosphere with warm hospitality, calm interiors, and events designed with care.",
    moments: [
      "Tea service on the terrace",
      "Curated breakfast spreads",
      "Evening poolside calm",
      "Personalized event planning",
    ],
  },

  roomsSection: {
    title: "Rooms for every kind of stay",
    description:
      "Five categories designed for couples, families, and business stays.",
  },

  offersSection: {
    title: "Current offers",
    description: "Curated stays with thoughtful extras included.",
    // Split around the inline enquiry link.
    emptyBefore: "No active offers at the moment. Check back soon or",
    emptyLinkLabel: "send an enquiry",
    emptyAfter: "and we will tailor something for your dates.",
  },

  photoCaption: {
    eyebrow: "Stay the Kishori way",
    description:
      "Comfort that feels earned. Greenery that feels endless. A stay you will remember long after checkout",
  },
};

/* ----------------------------------------------------------------- about */

export const about = {
  meta: {
    title: "About",
    description:
      "Learn about KiSHORi VATiKA, our rooms, dining, and event spaces designed for elegant stays.",
  },
  header: {
    eyebrow: "About us",
    title: "A resort built for refined stays.",
    description:
      "is a thoughtfully designed hotel with elegant rooms, calm interiors, and warm hospitality. We focus on comfort, privacy, and the small details that make every stay feel effortless.",
  } as PageHeader,

  propertyHighlights: [
    "5 room categories",
    "20 rooms total",
    "Restaurant and dining",
    "Swimming pool",
    "Banquet, small hall, and lawn",
  ],

  values: [
    {
      title: "Warm hospitality",
      description:
        "A small team, attentive service, and a calm pace that lets you settle in quickly.",
    },
    {
      title: "Boutique comfort",
      description:
        "Twenty rooms across five categories, with thoughtful layouts and restful interiors.",
    },
    {
      title: "Celebrations made easy",
      description:
        "One banquet, one small hall, and one lawn supported by a focused, experienced events team.",
    },
  ] as TitledItem[],

  story: {
    title: "Our story",
    // Split so the brand name can be rendered in the display face between them.
    bodyBefore: "We created",
    bodyAfter:
      "to feel like a proper hotel stay with boutique charm. Whether you are here for a weekend escape, a family gathering, or a formal celebration, our spaces are designed to keep things simple, elegant, and comfortable.",
    primaryCta: { label: "View current offers", href: "/offers" } as Cta,
    secondaryCta: { label: "Get in touch", href: "/contact" } as Cta,
  },

  expectations: {
    title: "What to expect",
    items: [
      "Concierge-led service for stays and events.",
      "Restaurant dining with tailored menus on request.",
      "The only pool in the area. Dive in, cool down, let the afternoon disappear.",
      "Event support for weddings, corporate stays, and celebrations.",
    ],
  },
};

/* --------------------------------------------------------------- contact */

export const contact = {
  meta: {
    title: "Contact",
    description:
      "Get in touch for bookings and enquiries. We respond within 24 hours.",
  },
  header: {
    eyebrow: "Contact",
    title: "We would love to plan your stay.",
    description:
      "For bookings and enquiries, the quickest way to reach us is through the enquiry form. We respond within 24 hours and can tailor rooms, dining, and event setups for your dates.",
  } as PageHeader,

  messageBlock: {
    title: "Send a message",
    description:
      "Prefer a quick note? Share your dates and we will respond with availability and pricing details.",
  },

  checklist: {
    title: "What we typically need",
    items: [
      "Preferred dates and guest count.",
      "Room category or event needs.",
      "Any special requests or timing.",
    ],
  },

  items: [
    {
      title: "Enquiries and bookings",
      description:
        "Share your dates, room preference, and event needs. Our team responds within 24 hours.",
      action: { label: "Send an enquiry", href: "/enquiry" } as Cta,
    },
    {
      title: "Location",
      description:
        "Quiet hillside location, about 10 minutes from the city center. Address shared upon confirmation.",
      note: "Add your exact address and map link here before launch.",
    },
    {
      title: "Phone and WhatsApp",
      description:
        "Prefer to speak directly? Add your phone, WhatsApp, and email details here.",
    },
  ],
};

/* ---------------------------------------------------------------- offers */

export const offers = {
  meta: {
    title: "Offers",
    description:
      "Curated stay packages with dining, experiences, and event options at KiSHORi VATiKA.",
  },
  header: {
    eyebrow: "Offers",
    title: "Curated stays with thoughtful extras.",
    description:
      "These packages highlight the kinds of experiences we can create for your stay. Enquire to confirm availability and custom details for your dates.",
  } as PageHeader,

  categories: [
    "Weekend getaways",
    "Business stays",
    "Celebrations",
    "Family escapes",
  ],

  enquireLabel: "Enquire about this",

  empty: {
    description:
      "No active offers at the moment. We are updating packages - check back soon or send an enquiry and we will tailor something for your dates.",
    cta: { label: "Send an enquiry", href: "/enquiry" } as Cta,
  },

  callout: {
    title: "Looking for something specific?",
    description:
      "Tell us your dates, number of guests, and the kind of experience you are after - quiet work week, anniversary celebration, or a family break - and we will respond with tailored options.",
    cta: { label: "Send an enquiry", href: "/enquiry" } as Cta,
  },

  detail: {
    eyebrow: "Offer",
    includesTitle: "What is included",
    asideTitle: "Ready to plan your stay?",
    asideDescription:
      "Share your dates, number of guests, and any special requests. Our team will get back to you with availability and pricing within 24 hours.",
    primaryCta: { label: "Enquire about this offer", href: "/enquiry" } as Cta,
    secondaryCta: { label: "View all offers", href: "/offers" } as Cta,
    notFound: {
      title: "Offer not found",
      description:
        "This offer does not exist or is no longer active. Browse our current offers or send an enquiry and we will curate something for your dates.",
      primaryCta: { label: "Back to offers", href: "/offers" } as Cta,
      secondaryCta: { label: "Send an enquiry", href: "/enquiry" } as Cta,
    },
  },
};

/* ------------------------------------------------------------ facilities */

export const facilitiesPage = {
  meta: {
    title: "Facilities",
    description:
      "Explore all facilities including restaurant, lawn, pool, banquet, and event spaces.",
  },
  header: {
    eyebrow: "Facilities",
    title: "Facilities at",
    description:
      "Everything the property offers, from all-day dining to open lawns built for celebration. Open any facility for photos and details.",
  } as PageHeader,

  callout: {
    title: "Planning a celebration?",
    description:
      "Share your dates and guest count and our team will suggest the right space, layout, and catering for the occasion.",
    primaryCta: { label: "Enquire now", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Talk to team", href: "/contact" } as Cta,
  },

  detail: {
    breadcrumb: "Facilities",
    specLabels: {
      timing: "Timing",
      bestFor: "Best for",
      capacity: "Capacity",
      access: "Access",
    },
    viewLabel: "View",
    highlightsTitle: "Highlights",
    amenitiesTitle: "Amenities",
    asideTitle: "Planning something here?",
    asideDescription:
      "Tell us your dates and guest count and we will come back with availability, layouts, and pricing.",
    otherTitle: "Other facilities",
    primaryCta: { label: "Enquire now", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Talk to team", href: "/contact" } as Cta,
  },
};

/* ----------------------------------------------------------------- rooms */

export const roomsPage = {
  meta: {
    title: "Rooms",
    description:
      "Explore all room categories with photos, amenities, and stay details.",
  },
  header: {
    eyebrow: "Rooms",
    title: "Room categories at",
    description:
      "Browse each room category with detailed specs, amenities, and larger photo sections.",
  } as PageHeader,

  detail: {
    highlightsTitle: "Room highlights",
    amenitiesTitle: "Amenities",
    primaryCta: { label: "Enquire for this room", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Talk to team", href: "/contact" } as Cta,
  },
};

/* --------------------------------------------------------------- enquiry */

export const enquiry = {
  header: {
    eyebrow: "Enquiry",
    title: "Tell us about your stay.",
    description:
      "Share your dates, number of guests, and any special occasion. We will respond with availability, pricing, and room suggestions that fit your needs.",
  } as PageHeader,

  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "you@example.com" },
    phone: {
      label: "Phone (optional)",
      placeholder: "Include country code if outside India",
    },
    guests: { label: "Guests" },
    checkIn: { label: "Check-in" },
    checkOut: { label: "Check-out" },
    offer: {
      label: "Interested in a specific offer?",
      hint: "(optional, pre-filled if you came from an offer page)",
      placeholder: "Offer name or leave blank for general enquiry",
    },
    message: {
      label: "Anything you would like us to know?",
      placeholder:
        "Share the purpose of your trip, dietary preferences, or room requests.",
    },
  },

  submit: {
    idle: "Send enquiry",
    submitting: "Sending your enquiry...",
    submitted: "Enquiry sent",
  },

  responseNote: { before: "We usually respond within", value: "24 hours" },

  success:
    "Thank you for reaching out. We have received your enquiry and will get back to you with availability and pricing within 24 hours.",
  genericError: "Something went wrong. Please try again.",
  networkError: "Network error. Please check your connection and try again.",
  loading: "Loading enquiry form...",

  notes: {
    title: "Helpful notes",
    items: [
      "Children are welcome. Share ages and we will suggest the best room configuration.",
      "Dietary preferences can be accommodated with advance notice.",
      "Celebrations can include room decor, cake, or a private dinner.",
    ],
  },

  fasterResponse: {
    title: "Need a faster response?",
    description:
      "Mention urgent timelines in your message and we will prioritize your request.",
    note: "Phone and WhatsApp details can be added here once ready to publish.",
  },
};

/* ------------------------------------------------------------------ forms */

export const contactForm = {
  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "you@example.com" },
    phone: {
      label: "Phone (optional)",
      placeholder: "Include country code if outside India",
    },
    message: { label: "Message", placeholder: "Tell us how we can help" },
  },
  submit: {
    idle: "Send message",
    submitting: "Sending...",
    submitted: "Message sent",
  },
  success: "Thanks for reaching out. We will respond within 24 hours.",
  genericError: "Failed to send message",
  networkError: "Network error. Please try again.",
};

export const newsletter = {
  placeholder: "Email for updates",
  submit: {
    idle: "Join updates",
    submitting: "Joining...",
    submitted: "Subscribed",
  },
  genericError: "Failed to subscribe",
  networkError: "Network error. Please try again.",
};

/* ---------------------------------------------------------------- footer */

export const footer = {
  rights: "All rights reserved.",
  tagline: "resort and event spaces.",
  credit: "Crafted with Next.js and Tailwind.",
  newsletter: {
    title: "Stay in the loop",
    description: "Monthly updates on offers, events, and seasonal dining.",
  },
};

/* -------------------------------------------------------------- navigation */

export const navLinks: Cta[] = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Facilities", href: "/facilities" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
