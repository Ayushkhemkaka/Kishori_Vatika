import { NextResponse } from "next/server";
import {
  fetchGoogleReviews,
  getServerPlacesKey,
} from "@/app/(shared)/lib/google-reviews";
import {
  fetchBusinessReviews,
  hasBusinessProfileConfig,
} from "@/app/(shared)/lib/google-business";

const CACHE_SECONDS = 3600;

/**
 * JSON view of the reviews the site renders, and the diagnostic for setting
 * them up: it reports what each source did rather than a single opaque error,
 * because the two have entirely different failure modes.
 */
export async function GET() {
  const business = hasBusinessProfileConfig()
    ? await fetchBusinessReviews(5)
    : null;

  if (business?.reviews.length) {
    return NextResponse.json(
      {
        source: "business-profile",
        overallRating: business.rating,
        totalReviews: business.total,
        reviews: business.reviews,
      },
      { headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` } }
    );
  }

  const places = getServerPlacesKey() ? await fetchGoogleReviews(5) : null;

  if (places?.reviews.length) {
    return NextResponse.json(
      {
        source: "places",
        overallRating: places.rating,
        totalReviews: places.total,
        reviews: places.reviews,
      },
      { headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` } }
    );
  }

  return NextResponse.json(
    {
      error: "No review source returned data.",
      businessProfile: hasBusinessProfileConfig()
        ? "Configured, but returned nothing. Usual cause: the project is not yet approved for the Business Profile API, or GOOGLE_BUSINESS_LOCATION is wrong."
        : "Not configured. Run `npm run google:setup` and set GOOGLE_OAUTH_* and GOOGLE_BUSINESS_LOCATION.",
      places: getServerPlacesKey()
        ? "Configured, but Google refused. A referer-restricted browser key cannot be used server-side; use an IP-restricted key in GOOGLE_PLACES_SERVER_KEY."
        : "Not configured. Set GOOGLE_PLACES_SERVER_KEY and GOOGLE_PLACE_ID.",
    },
    { status: 502 }
  );
}
