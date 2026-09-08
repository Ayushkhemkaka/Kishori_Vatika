import { home } from "@/content/site-content";

/**
 * Google map of the property, embedded with the Maps Embed API.
 *
 * The Embed API is loaded by the visitor's browser, which is why it works
 * with a referer-restricted key (the same key cannot be used for the
 * server-side Places API, so reviews are not fetched here). The key does
 * appear in the page HTML - that is how the Embed API is meant to be used,
 * and the referer restriction is what keeps it from being used elsewhere.
 *
 * With no key or place id configured the map is skipped entirely and only
 * the directions link is rendered, so the section never shows a broken frame.
 */
export function LocationMap() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const embedSrc =
    apiKey && placeId
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}&zoom=15`
      : null;

  const directionsHref = placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        home.locationSection.mapQuery
      )}&query_place_id=${placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        home.locationSection.mapQuery
      )}`;

  return (
    <div className="space-y-3">
      {embedSrc ? (
        <div className="overflow-hidden rounded-2xl border border-emerald-100">
          <iframe
            src={embedSrc}
            title={home.locationSection.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-64 w-full border-0 sm:h-72"
          />
        </div>
      ) : null}

      <a
        href={directionsHref}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-600"
      >
        {home.locationSection.directionsLabel} &rarr;
      </a>
    </div>
  );
}
