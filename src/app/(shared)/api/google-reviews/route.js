import { NextResponse } from "next/server";

const REQUIRED_FIELDS = "rating,user_ratings_total,reviews";
const CACHE_SECONDS = 300;

function buildPlaceDetailsUrl() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_BUSINESS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", REQUIRED_FIELDS);

  return url;
}

function normalizeReview(review) {
  return {
    author: review.author_name,
    rating: review.rating,
    text: review.text,
    relativeTime: review.relative_time_description,
    profilePhoto: review.profile_photo_url,
    time: review.time
  };
}

export async function GET() {
  const url = buildPlaceDetailsUrl();
  if (!url) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID" },
      { status: 400 }
    );
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: CACHE_SECONDS }
  });

  const payload = await response.json();

  if (!response.ok || payload.status !== "OK") {
    const message = payload?.error_message ?? payload.status ?? "Failed to fetch place details";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const reviews = (payload.result.reviews ?? [])
    .map(normalizeReview)
    .slice(0, 4);

  const result = {
    overallRating: payload.result.rating ?? null,
    totalReviews: payload.result.user_ratings_total ?? null,
    reviews
  };

  return NextResponse.json(result, {
    headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` }
  });
}
