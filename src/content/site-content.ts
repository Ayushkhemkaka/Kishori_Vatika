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
  location: "Ramnagar, Bihar · Resort & Restaurant",
  responseTime: "We respond within 24 hours.",
};

/* ------------------------------------------------------------------ home */

export const home = {
  hero: {
    eyebrow: site.location,
    title: "Where greenery hosts your grandest celebrations",
    titleAccent: "and your quietest escapes.",
    description:
      "West Champaran's first resort. Stay, swim, celebrate, all surrounded by nature.",
    primaryCta: { label: "Check availability", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Explore rooms", href: "/rooms" } as Cta,
  },

  intro: {
    eyebrow: "Resorts & Restaurant",
    eyebrowNote: "Now booking",
    title: "A refined stay at",
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
      "Stay, swim, dine, celebrate. Everything under one roof, surrounded by green.",
    roomsCard: {
      title: "Rooms",
      badge: "Stay",
      description:
        "20 comfortable rooms with garden views. Clean, quiet, and built for rest, not just sleep.",
    },
  },

  experiencesSection: {
    title: "The Kishori experience",
    description:
      "No traffic. No noise. Just warm hospitality, calm spaces, and celebrations done with care.",
    contactCta: { label: "Speak with our team", href: "/contact" } as Cta,
    moments: [
      "Morning chai amidst birdsong",
      "Fresh desi breakfast spreads",
      "Poolside afternoons with family",
      "Shaadis planned down to the last detail",
    ],
  },

  locationSection: {
    title: "Find us",
    description:
      "Ten minutes from Ramnagar town, with parking on site and easy access for event convoys.",
    mapTitle: "Map showing KiSHORi VATiKA, Ramnagar, West Champaran",
    /* Used for the directions link, and as the map fallback when no place id
       is configured. Keep it specific enough to resolve on its own. */
    mapQuery: "KiSHORi VATiKA Resort, Ramnagar, West Champaran, Bihar",
    directionsLabel: "Get directions",
  },

  reviewsSection: {
    title: "What guests say",
    description: "Reviews from guests who have stayed and celebrated with us.",
    countBefore: "from",
    countAfter: "Google reviews",
    ctaLabel: "Read reviews on Google",
    /* Used only when the Google API returns nothing. Paste real quotes from
       the listing here - author, rating, text, and when it was left - and
       they render in place of the fetched ones. Left empty on purpose: the
       block shows nothing rather than anything invented. */
    manual: [] as { author: string; rating: number; text: string; when: string }[],
  },

  roomsSection: {
    title: "Rooms for every kind of stay",
    description:
      "Designed for couples, families, business travellers, and wedding guests alike.",
    inclusionNote: "Breakfast and Wi-Fi included",
    cardCta: "View room",
  },

  offersSection: {
    title: "Current offers",
    description: "Seasonal stays and celebration packages, crafted for you.",
    emptyBefore: "No active offers at the moment. Check back soon or",
    emptyLinkLabel: "send an enquiry",
    emptyAfter: "and we will tailor something for your dates.",
  },

  photoCaption: {
    eyebrow: "Stay the Kishori way",
    description:
      "No traffic. No noise. Just clean rooms, green views, and the kind of rest that cities cannot offer.",
  },
};

/* ----------------------------------------------------------------- about */

export const about = {
  meta: {
    title: "About",
    description:
      "Learn about KiSHORi VATiKA, West Champaran's first resort. Rooms, dining, pool, and event spaces designed for elegant stays and grand celebrations.",
  },
  header: {
    eyebrow: "About us",
    title: "A garden named after grace. Built for celebration.",
    description:
      "is West Champaran's first resort, set on the peaceful outskirts of Ramnagar. Built around the greenery and silence that define this land, we offer 20 rooms, a swimming pool, a restaurant, and event spaces for gatherings of up to 500 guests. Every detail is designed to make your stay feel personal and your celebration feel grand.",
  } as PageHeader,

  propertyHighlights: [
    "West Champaran's first resort",
    "20 rooms across 5 categories",
    "Restaurant with desi and event menus",
    "The only swimming pool in the area",
    "Banquet, 1 small hall, and a green lawn",
    "Children's play area",
  ],

  values: [
    {
      title: "Greenery first",
      description:
        "We did not build a resort and add gardens. We found the greenest land in West Champaran and built around it. Nature is not our backdrop, it is our foundation.",
    },
    {
      title: "Trust above all",
      description:
        "From transparent pricing to honest service, we believe real hospitality begins with trust. Every guest is parivaar.",
    },
    {
      title: "Celebrations made easy",
      description:
        "Grand shaadi or quiet birthday. Corporate meet or family trip. We believe every gathering deserves a beautiful setting, regardless of its size.",
    },
  ] as TitledItem[],

  story: {
    title: "Our story",
    bodyBefore: "We created",
    bodyAfter:
      "because West Champaran deserved a place where families could celebrate, travellers could rest, and nature could remain untouched. Set on the outskirts of Ramnagar, away from the rush of town, this resort was born from a simple belief: that luxury and nature belong together. Whether you are here for a weekend escape, a grand shaadi, or a corporate offsite, our spaces are designed to keep things elegant, comfortable, and distinctly ours.",
    primaryCta: { label: "View current offers", href: "/offers" } as Cta,
    secondaryCta: { label: "Get in touch", href: "/contact" } as Cta,
  },

  expectations: {
    title: "What to expect",
    items: [
      "Warm, attentive service from a team that treats every guest like parivaar.",
      "A restaurant serving fresh desi comfort food and custom event menus for up to 500 guests.",
      "The only pool in the area. Dive in, cool down, let the afternoon disappear.",
      "Full event support for shaadis, sangeet, birthdays, anniversaries, and corporate gatherings.",
      "A safe children's play area where little guests have their own adventure.",
    ],
  },
};

/* --------------------------------------------------------------- contact */

export const contact = {
  meta: {
    title: "Contact",
    description:
      "Get in touch with KiSHORi VATiKA for room bookings, event enquiries, and celebrations. We respond within 24 hours.",
  },
  header: {
    eyebrow: "Contact",
    title: "Aaiye, apna samjhiye.",
    description:
      "Whether you want to book a room, plan a shaadi, or simply know what we offer, we are here to help. Share your dates and requirements and our team will respond within 24 hours with availability and pricing.",
  } as PageHeader,

  messageBlock: {
    title: "Send a message",
    description:
      "Share your dates, guest count, and occasion. We will respond with the best options for your stay or celebration.",
  },

  checklist: {
    title: "What we typically need",
    items: [
      "Preferred dates and number of guests.",
      "Room category, event type, or celebration details.",
      "Any special requests for food, decor, or arrangements.",
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
        "On the peaceful outskirts of Ramnagar, West Champaran, Bihar. A quiet, green setting away from the noise of town.",
      note: "Add your exact address and Google Maps link here before launch.",
    },
    {
      title: "Phone and WhatsApp",
      description:
        "Prefer to speak directly? Call or WhatsApp us anytime. Add your phone number and email here.",
    },
  ],
};

/* ---------------------------------------------------------------- offers */

export const offers = {
  meta: {
    title: "Offers",
    description:
      "Seasonal stay packages, celebration deals, and event offers at KiSHORi VATiKA, West Champaran's first resort.",
  },
  header: {
    eyebrow: "Offers",
    title: "Stays and celebrations, thoughtfully packaged.",
    description:
      "Seasonal packages for getaways, shaadis, birthdays, and corporate stays. Enquire to confirm availability and we will customise the details for your dates.",
  } as PageHeader,

  categories: [
    "Weekend getaways",
    "Wedding packages",
    "Birthday & anniversary",
    "Corporate stays",
    "Family escapes",
  ],

  enquireLabel: "Enquire about this",

  empty: {
    description:
      "No active offers at the moment. We are preparing new packages. Check back soon or send an enquiry and we will tailor something for your dates and occasion.",
    cta: { label: "Send an enquiry", href: "/enquiry" } as Cta,
  },

  callout: {
    title: "Looking for something specific?",
    description:
      "Tell us your dates, number of guests, and the kind of occasion you have in mind. A quiet family weekend, a grand shaadi, a corporate offsite, or a birthday bash. We will respond with tailored options and pricing.",
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
        "This offer does not exist or is no longer active. Browse our current offers or send an enquiry and we will put together something for your dates.",
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
      "Explore all facilities at KiSHORi VATiKA including restaurant, swimming pool, banquet hall, lawn, small halls, and children's play area.",
  },
  header: {
    eyebrow: "Facilities",
    title: "Facilities at",
    description:
      "Everything the resort offers. From a desi kitchen that feeds 500 to a green lawn built for the grandest celebrations. Open any facility for photos and details.",
  } as PageHeader,

  callout: {
    title: "Planning a shaadi or celebration?",
    description:
      "Share your dates and guest count and our team will suggest the right venue, layout, menu, and decor for the occasion.",
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
      "20 rooms across 5 categories at KiSHORi VATiKA. Garden views, clean comfort, and the silence of West Champaran's greenest resort.",
  },
  header: {
    eyebrow: "Rooms",
    title: "Room categories at",
    description:
      "20 rooms designed for business travellers, couples, families, and wedding guests. Browse each category for photos, amenities, and pricing.",
  } as PageHeader,

  detail: {
    breadcrumb: "Rooms",
    specLabels: {
      price: "From",
      occupancy: "Occupancy",
      size: "Room size",
      bed: "Bed type",
    },
    viewLabel: "View room",
    highlightsTitle: "Room highlights",
    amenitiesTitle: "Amenities",
    asideTitle: "Ready to book this room?",
    asideDescription:
      "Share your dates and number of guests. We will confirm availability and pricing for this category within 24 hours.",
    otherTitle: "Other room categories",
    primaryCta: { label: "Enquire for this room", href: "/enquiry" } as Cta,
    secondaryCta: { label: "Talk to team", href: "/contact" } as Cta,
  },
};

/* --------------------------------------------------------------- enquiry */

export const enquiry = {
  header: {
    eyebrow: "Enquiry",
    title: "Tell us what you are planning.",
    description:
      "A room for the night, a weekend with family, or a shaadi for 500. Share your details and we will respond with availability, pricing, and the right setup for your occasion.",
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
        "Tell us about your occasion, dietary preferences, room requests, or event requirements.",
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
      "Children are welcome. Share ages and we will suggest the best room setup.",
      "Dietary preferences and special menus can be arranged with advance notice.",
      "Celebrations can include room decor, cake arrangements, or a private dinner on the lawn.",
      "For shaadis and large events, our team handles venue layout, catering, and coordination.",
    ],
  },

  fasterResponse: {
    title: "Need a faster response?",
    description:
      "Mention urgent timelines in your message and we will prioritise your request.",
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
    message: {
      label: "Message",
      placeholder:
        "Tell us about your stay, event, or any questions you have.",
    },
  },
  submit: {
    idle: "Send message",
    submitting: "Sending...",
    submitted: "Message sent",
  },
  success:
    "Thank you for reaching out. We will respond within 24 hours.",
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
  /** Short positioning line under the wordmark in the first column. */
  about:
    "West Champaran's first resort. Twenty rooms, a pool, a restaurant, and event spaces for up to 500 guests, set in the green quiet outside Ramnagar.",

  explore: {
    title: "Explore",
    // Kept separate from the header nav: a footer usually carries the
    // booking-intent pages the header does not have room for.
    links: [
      { label: "Rooms", href: "/rooms" },
      { label: "Facilities", href: "/facilities" },
      { label: "Offers", href: "/offers" },
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Enquire", href: "/enquiry" },
    ] as Cta[],
  },

  contact: {
    title: "Visit us",
    address: ["Outskirts of Ramnagar", "West Champaran, Bihar, India"],
    /* Fill these in before launch. Each is rendered only when non-empty, so
       an unset value leaves no dead link or blank row in the footer. */
    phone: "",
    whatsapp: "",
    email: "",
    hoursLabel: "Reception",
    hours: "Open 24 hours",
  },

  stay: {
    title: "Your stay",
    items: [
      { label: "Check-in", value: "12:00 pm" },
      { label: "Check-out", value: "10:00 am" },
      { label: "Rooms", value: "20 across 5 categories" },
      { label: "Events", value: "Banquet, small hall, lawn" },
    ],
  },

  /* Social profiles. Add { label, href } entries and the row appears; the
     block stays hidden while this is empty rather than linking nowhere. */
  socials: [] as Cta[],

  bookCta: { label: "Check availability", href: "/enquiry" } as Cta,

  rights: "All rights reserved.",
  tagline: "West Champaran ka apna resort.",
  credit: "Crafted with Next.js and Tailwind.",
  newsletter: {
    title: "Stay in the loop",
    description:
      "Seasonal offers, upcoming events, and new experiences, a few times a year.",
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