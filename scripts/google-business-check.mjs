/**
 * Reports how far the Google Business Profile setup has got.
 *
 *   node scripts/google-business-check.mjs      (npm run google:check)
 *
 * Each step prints ok / missing / failed with the reason Google gave, so the
 * setup can be worked through one message at a time instead of guessing at a
 * single "no reviews" symptom.
 */

import "dotenv/config";

const ok = (msg) => console.log(`  ok      ${msg}`);
const bad = (msg) => console.log(`  FAILED  ${msg}`);
const skip = (msg) => console.log(`  missing ${msg}`);

const {
  GOOGLE_OAUTH_CLIENT_ID: clientId,
  GOOGLE_OAUTH_CLIENT_SECRET: clientSecret,
  GOOGLE_OAUTH_REFRESH_TOKEN: refreshToken,
  GOOGLE_BUSINESS_LOCATION: location,
} = process.env;

console.log("\nGoogle Business Profile reviews\n");

console.log("1. OAuth client");
if (clientId && clientSecret) ok("client id and secret present");
else {
  skip("GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET not set in .env");
  console.log("\n  Create an OAuth client (Web application) in the Cloud console");
  console.log("  with redirect URI http://localhost:5055/oauth2callback\n");
  process.exit(0);
}

console.log("\n2. Refresh token");
if (!refreshToken) {
  skip("GOOGLE_OAUTH_REFRESH_TOKEN not set - run: npm run google:setup");
  process.exit(0);
}

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  }),
});
const tokenPayload = await tokenRes.json();

if (!tokenRes.ok) {
  bad(`token refresh: ${tokenPayload.error_description ?? tokenPayload.error}`);
  console.log("\n  Re-run: npm run google:setup\n");
  process.exit(1);
}
ok("access token obtained");

const headers = { Authorization: `Bearer ${tokenPayload.access_token}` };

console.log("\n3. Account access");
const accountsRes = await fetch(
  "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
  { headers }
);
const accountsPayload = await accountsRes.json();
if (!accountsRes.ok) {
  bad(accountsPayload.error?.message ?? `HTTP ${accountsRes.status}`);
  console.log(
    "\n  Usually: 'My Business Account Management API' is not enabled on the project.\n"
  );
} else {
  ok(`${(accountsPayload.accounts ?? []).length} account(s) visible`);
}

console.log("\n4. Location");
if (!location) {
  skip("GOOGLE_BUSINESS_LOCATION not set - npm run google:setup lists yours");
  process.exit(0);
}
if (!/^accounts\/[^/]+\/locations\/[^/]+$/.test(location)) {
  bad(`"${location}" is not in the form accounts/<id>/locations/<id>`);
  process.exit(1);
}
ok(location);

console.log("\n5. Reviews");
const reviewsRes = await fetch(
  `https://mybusiness.googleapis.com/v4/${location}/reviews?pageSize=3`,
  { headers }
);
const reviewsPayload = await reviewsRes.json();

if (reviewsRes.ok) {
  const count = (reviewsPayload.reviews ?? []).length;
  ok(
    `${count} review(s) fetched, average ${reviewsPayload.averageRating ?? "n/a"}`
  );
  console.log("\nReviews are live. Restart the dev server to see them.\n");
} else {
  const message = reviewsPayload.error?.message ?? `HTTP ${reviewsRes.status}`;
  bad(message);
  if (reviewsRes.status === 429 || /quota/i.test(message)) {
    console.log(
      "\n  This is the expected state until Google approves the project for the"
    );
    console.log("  Business Profile APIs. Submit the access request form:");
    console.log("  https://developers.google.com/my-business/content/prereqs\n");
  } else if (reviewsRes.status === 403) {
    console.log(
      "\n  Enable 'Google My Business API' on the project, and check the signed-in"
    );
    console.log("  account actually manages this location.\n");
  }
}
