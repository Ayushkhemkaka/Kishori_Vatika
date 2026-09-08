/**
 * Google Business Profile reviews.
 *
 * This is a different product from the Places API used elsewhere in this
 * file's neighbour: Places returns at most five reviews of any public place
 * and needs only an API key, while the Business Profile API returns every
 * review of a listing you own and authenticates as the owner over OAuth.
 *
 * Required environment:
 *   GOOGLE_OAUTH_CLIENT_ID       from the Cloud console OAuth client
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GOOGLE_OAUTH_REFRESH_TOKEN   minted once, see scripts/google-business-setup.mjs
 *   GOOGLE_BUSINESS_LOCATION     e.g. accounts/123456/locations/789012
 *
 * Access also has to be granted by Google: the reviews endpoint lives on the
 * legacy My Business API v4, whose quota is zero until the project is
 * approved through Google's Business Profile API access request form.
 *
 * Every failure returns null. Reviews are decoration on a marketing page and
 * must not be able to break it.
 */

import type { GoogleReviewSummary } from "./google-reviews";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REVIEWS_HOST = "https://mybusiness.googleapis.com/v4";

const STAR_VALUES: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

type ApiReview = {
  reviewer?: { displayName?: string | null } | null;
  starRating?: string | null;
  comment?: string | null;
  updateTime?: string | null;
  createTime?: string | null;
};

/** Cached across requests in a warm server; refreshed a minute before expiry. */
let cachedToken: { value: string; expiresAt: number } | null = null;

export function hasBusinessProfileConfig() {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
      process.env.GOOGLE_BUSINESS_LOCATION
  );
}

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN ?? "",
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!payload.access_token) return null;

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + ((payload.expires_in ?? 3600) - 60) * 1000,
  };
  return cachedToken.value;
}

/** "3 months ago" from a timestamp, matching how Google labels its reviews. */
function relativeTime(iso: string | null | undefined) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 31) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export async function fetchBusinessReviews(
  limit = 3
): Promise<GoogleReviewSummary | null> {
  if (!hasBusinessProfileConfig()) return null;

  try {
    const token = await getAccessToken();
    if (!token) return null;

    const location = process.env.GOOGLE_BUSINESS_LOCATION ?? "";
    const url = new URL(`${REVIEWS_HOST}/${location}/reviews`);
    // Ask for more than we render: reviews without comments are dropped below.
    url.searchParams.set("pageSize", String(Math.max(limit * 3, 10)));
    url.searchParams.set("orderBy", "updateTime desc");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      reviews?: ApiReview[] | null;
      averageRating?: number | null;
      totalReviewCount?: number | null;
    };

    const reviews = (payload.reviews ?? [])
      .map((review) => ({
        author: review.reviewer?.displayName ?? "Google guest",
        rating: STAR_VALUES[review.starRating ?? ""] ?? 0,
        text: (review.comment ?? "").trim(),
        when: relativeTime(review.updateTime ?? review.createTime),
      }))
      // A star-only review has no comment; it counts toward the average but
      // there is nothing to quote.
      .filter((review) => review.text.length > 0 && review.rating > 0)
      .slice(0, limit);

    return {
      rating: payload.averageRating ?? null,
      total: payload.totalReviewCount ?? null,
      reviews,
    };
  } catch {
    return null;
  }
}
