"use client";

import { useEffect, useState } from "react";
import { home } from "@/content/site-content";
import type {
  GoogleReview,
  GoogleReviewSummary,
} from "@/app/(shared)/lib/google-reviews";

/**
 * Google reviews for the property.
 *
 * Three sources, in order of preference:
 *   1. `initial` - fetched on the server and rendered in the HTML. Best for
 *      SEO and needs no key in the page.
 *   2. the Maps JavaScript API, used only when the server returned nothing.
 *      This is the path a referer-restricted browser key can take, and the
 *      key it needs is passed in explicitly.
 *   3. `home.reviewsSection.manual` - quotes pasted from the Google listing
 *      by hand, for when neither credential is available.
 *
 * If all three are empty the block degrades to its heading and a link to the
 * Google listing; a guest never sees an error or an empty frame.
 */

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary?: (name: string) => Promise<Record<string, unknown>>;
      };
    };
  }
}

const SCRIPT_ID = "google-maps-js";

function loadMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.google?.maps?.importLibrary) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  const script = existing ?? document.createElement("script");

  const ready = new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("maps failed")));
  });

  if (!existing) {
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places`;
    document.head.appendChild(script);
  }

  return ready;
}

type LegacyReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
};

type LegacyPlace = {
  rating?: number;
  user_ratings_total?: number;
  reviews?: LegacyReview[];
};

type LegacyService = {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: LegacyPlace | null, status: string) => void
  ) => void;
};

/**
 * Reviews through the classic PlacesService.
 *
 * Tried first because it rides on the Maps JavaScript API, which a
 * referer-restricted browser key is allowed to use, and because the classic
 * Places API is the one enabled on most existing projects. `Place` (Places
 * API New) is a separate product that has to be switched on explicitly.
 */
async function fetchLegacy(
  lib: Record<string, unknown>,
  placeId: string
): Promise<GoogleReviewSummary | null> {
  const ServiceCtor = lib.PlacesService as
    | (new (attrContainer: HTMLElement) => LegacyService)
    | undefined;
  if (!ServiceCtor) return null;

  const service = new ServiceCtor(document.createElement("div"));
  const place = await new Promise<LegacyPlace | null>((resolve) => {
    service.getDetails(
      { placeId, fields: ["rating", "user_ratings_total", "reviews"] },
      (result, status) => {
        if (status !== "OK") {
          // The status is the only clue to a misconfigured key or a Places
          // product that is not switched on, and it is otherwise swallowed.
          console.warn(`[reviews] Google Places status: ${status}`);
          resolve(null);
          return;
        }
        resolve(result);
      }
    );
  });
  if (!place) return null;

  return {
    rating: place.rating ?? null,
    total: place.user_ratings_total ?? null,
    reviews: (place.reviews ?? [])
      .filter((review) => Boolean(review.text))
      .slice(0, 3)
      .map((review) => ({
        author: review.author_name ?? "Google guest",
        rating: review.rating ?? 5,
        text: review.text ?? "",
        when: review.relative_time_description ?? "",
      })),
  };
}

type NewPlace = {
  fetchFields: (o: { fields: string[] }) => Promise<unknown>;
  rating?: number | null;
  userRatingCount?: number | null;
  reviews?: Array<{
    rating?: number | null;
    text?: string | null;
    relativePublishTimeDescription?: string | null;
    authorAttribution?: { displayName?: string | null } | null;
  }> | null;
};

/** Places API (New), used when the project has moved to it. */
async function fetchNew(
  lib: Record<string, unknown>,
  placeId: string
): Promise<GoogleReviewSummary | null> {
  const PlaceCtor = lib.Place as
    | (new (options: { id: string }) => NewPlace)
    | undefined;
  if (!PlaceCtor) return null;

  const place = new PlaceCtor({ id: placeId });
  await place.fetchFields({ fields: ["rating", "userRatingCount", "reviews"] });

  return {
    rating: place.rating ?? null,
    total: place.userRatingCount ?? null,
    reviews: (place.reviews ?? [])
      .filter((review) => Boolean(review.text))
      .slice(0, 3)
      .map((review) => ({
        author: review.authorAttribution?.displayName ?? "Google guest",
        rating: review.rating ?? 5,
        text: review.text ?? "",
        when: review.relativePublishTimeDescription ?? "",
      })),
  };
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5`}>
      {"★★★★★".slice(0, rounded)}
      <span className="text-stone-300">{"★★★★★".slice(rounded)}</span>
    </span>
  );
}

export function GoogleReviews({
  initial,
  browserKey,
  placeId,
}: {
  initial: GoogleReviewSummary | null;
  browserKey?: string;
  placeId?: string;
}) {
  const [data, setData] = useState<GoogleReviewSummary | null>(initial);

  useEffect(() => {
    // Only reach for the browser API when the server could not supply reviews.
    if (data?.reviews.length) return;
    if (!browserKey || !placeId) return;
    let cancelled = false;

    (async () => {
      try {
        await loadMaps(browserKey);
        const lib = await window.google?.maps?.importLibrary?.("places");
        if (!lib) return;

        let summary: GoogleReviewSummary | null = null;
        try {
          summary = await fetchLegacy(lib, placeId);
        } catch {
          summary = null;
        }
        if (!summary?.reviews.length) {
          try {
            summary = (await fetchNew(lib, placeId)) ?? summary;
          } catch {
            // keep whatever the classic path produced
          }
        }

        if (!cancelled && summary?.reviews.length) setData(summary);
      } catch {
        // Falls through to the manual quotes, then to the link-only state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data, browserKey, placeId]);

  const manual = home.reviewsSection.manual as GoogleReview[];
  const reviews = data?.reviews.length ? data.reviews : manual;

  const profileHref = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        home.locationSection.mapQuery
      )}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
            {home.reviewsSection.title}
          </h2>
          {data?.rating ? (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-600">
              <Stars rating={data.rating} />
              <span className="font-semibold text-stone-900">
                {data.rating.toFixed(1)}
              </span>
              {data.total ? (
                <span>
                  {home.reviewsSection.countBefore} {data.total}{" "}
                  {home.reviewsSection.countAfter}
                </span>
              ) : null}
            </p>
          ) : (
            <p className="mt-1 text-sm text-stone-600">
              {home.reviewsSection.description}
            </p>
          )}
        </div>
        <a
          href={profileHref}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
        >
          {home.reviewsSection.ctaLabel} &rarr;
        </a>
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={`${review.author}-${review.when}-${review.text.slice(0, 24)}`}
              className="flex h-full flex-col justify-between rounded-md border border-emerald-100 bg-white p-5"
            >
              <blockquote className="line-clamp-6 text-sm leading-relaxed text-stone-600">
                {review.text}
              </blockquote>
              <figcaption className="mt-4 text-xs text-stone-500">
                <Stars rating={review.rating} />
                <span className="ml-2 font-medium text-stone-900">
                  {review.author}
                </span>
                {review.when ? <span> &middot; {review.when}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}
