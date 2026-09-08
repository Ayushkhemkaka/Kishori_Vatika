/**
 * Google reviews for the property, fetched on the server.
 *
 * Two sources, tried in order by fetchReviews():
 *   1. the Business Profile API (google-business.ts) - every review of the
 *      listing you own, authenticated as the owner over OAuth;
 *   2. the Places API below - at most five reviews of any public place,
 *      authenticated with a key.
 *
 * Credential note for the Places path: a browser key with HTTP-referrer
 * restrictions is rejected by every server-side Google endpoint, so this
 * looks for a server key first (GOOGLE_PLACES_SERVER_KEY - restrict it by IP,
 * not referrer) and only falls back to GOOGLE_MAPS_API_KEY for projects whose
 * key is unrestricted.
 *
 * Every failure path returns null rather than throwing: the reviews block is
 * decoration on a marketing page and must never take the page down with it.
 */

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  when: string;
};

export type GoogleReviewSummary = {
  rating: number | null;
  total: number | null;
  reviews: GoogleReview[];
};

const FIELDS = "rating,userRatingCount,reviews";
const REVALIDATE_SECONDS = 3600;

type PlacesReview = {
  rating?: number | null;
  text?: { text?: string | null } | null;
  originalText?: { text?: string | null } | null;
  relativePublishTimeDescription?: string | null;
  authorAttribution?: { displayName?: string | null } | null;
};

export function getServerPlacesKey() {
  return process.env.GOOGLE_PLACES_SERVER_KEY || process.env.GOOGLE_MAPS_API_KEY;
}

export async function fetchGoogleReviews(
  limit = 3
): Promise<GoogleReviewSummary | null> {
  const key = getServerPlacesKey();
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": FIELDS,
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      rating?: number | null;
      userRatingCount?: number | null;
      reviews?: PlacesReview[] | null;
    };

    const reviews = (payload.reviews ?? [])
      .map((review) => ({
        author: review.authorAttribution?.displayName ?? "Google guest",
        rating: review.rating ?? 5,
        text: review.text?.text ?? review.originalText?.text ?? "",
        when: review.relativePublishTimeDescription ?? "",
      }))
      .filter((review) => review.text.trim().length > 0)
      .slice(0, limit);

    return {
      rating: payload.rating ?? null,
      total: payload.userRatingCount ?? null,
      reviews,
    };
  } catch {
    return null;
  }
}

/**
 * The reviews the site renders: owner-authenticated ones when the Business
 * Profile API is configured and answering, otherwise whatever Places can
 * supply, otherwise null for the caller to fall back on.
 */
export async function fetchReviews(
  limit = 3
): Promise<GoogleReviewSummary | null> {
  const { fetchBusinessReviews } = await import("./google-business");

  const business = await fetchBusinessReviews(limit);
  if (business?.reviews.length) return business;

  const places = await fetchGoogleReviews(limit);
  // Keep the Business Profile rating summary even when only Places had text.
  if (places?.reviews.length) return places;

  return business ?? places;
}
