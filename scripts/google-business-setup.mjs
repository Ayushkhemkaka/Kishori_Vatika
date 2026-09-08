/**
 * One-time setup for Google Business Profile reviews.
 *
 *   node scripts/google-business-setup.mjs
 *
 * Walks the OAuth consent flow, prints the refresh token, then lists the
 * accounts and locations the signed-in user manages so the right
 * GOOGLE_BUSINESS_LOCATION can be copied into .env.
 *
 * Before running, in the Google Cloud console for this project:
 *   1. enable "My Business Account Management API", "My Business Business
 *      Information API" and "Google My Business API";
 *   2. create an OAuth client of type "Web application" and add
 *      http://localhost:5055/oauth2callback as an authorised redirect URI;
 *   3. put its id and secret in .env as GOOGLE_OAUTH_CLIENT_ID and
 *      GOOGLE_OAUTH_CLIENT_SECRET.
 *
 * Note that the reviews endpoint itself needs Google to approve the project
 * through the Business Profile API access request form; until then the other
 * calls work but reviews return a quota error.
 */

import http from "node:http";
import { URL, URLSearchParams } from "node:url";
import "dotenv/config";

const PORT = 5055;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/business.manage";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET in .env"
  );
  process.exit(1);
}

/** Serves the redirect URI once and resolves with the authorisation code. */
function waitForCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      if (url.pathname !== "/oauth2callback") {
        res.writeHead(404).end();
        return;
      }

      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        `<p>${code ? "Done. You can close this tab and return to the terminal." : `Authorisation failed: ${error}`}</p>`
      );

      server.close();
      if (code) resolve(code);
      else reject(new Error(error ?? "no code returned"));
    });

    server.on("error", (err) => {
      reject(
        err.code === "EADDRINUSE"
          ? new Error(`Port ${PORT} is in use. Close what holds it and re-run.`)
          : err
      );
    });

    server.listen(PORT, () => {
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.searchParams.set("client_id", clientId);
      auth.searchParams.set("redirect_uri", REDIRECT_URI);
      auth.searchParams.set("response_type", "code");
      auth.searchParams.set("scope", SCOPE);
      // Both are required for Google to hand back a refresh token.
      auth.searchParams.set("access_type", "offline");
      auth.searchParams.set("prompt", "consent");

      console.log("\nOpen this URL and sign in as the listing owner:\n");
      console.log(auth.toString());
      console.log("\nWaiting for the redirect...");
    });
  });
}

async function exchangeCode(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      `Token exchange failed: ${payload.error_description ?? payload.error}`
    );
  }
  return payload;
}

async function listLocations(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const accountsRes = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    { headers }
  );
  const accountsPayload = await accountsRes.json();
  if (!accountsRes.ok) {
    console.error(
      "\nCould not list accounts:",
      accountsPayload.error?.message ?? accountsRes.status
    );
    return;
  }

  for (const account of accountsPayload.accounts ?? []) {
    console.log(`\nAccount: ${account.name} (${account.accountName ?? ""})`);

    const locationsUrl = new URL(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations`
    );
    locationsUrl.searchParams.set("readMask", "name,title");
    locationsUrl.searchParams.set("pageSize", "100");

    const locationsRes = await fetch(locationsUrl, { headers });
    const locationsPayload = await locationsRes.json();
    if (!locationsRes.ok) {
      console.error(
        "  Could not list locations:",
        locationsPayload.error?.message ?? locationsRes.status
      );
      continue;
    }

    for (const location of locationsPayload.locations ?? []) {
      // GOOGLE_BUSINESS_LOCATION wants the full accounts/*/locations/* path.
      console.log(
        `  ${location.title ?? "(untitled)"} -> ${account.name}/${location.name}`
      );
    }
  }
}

const code = await waitForCode();
const tokens = await exchangeCode(code);

console.log("\nAdd this to .env:\n");
console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token ?? "(none returned)"}`);

if (!tokens.refresh_token) {
  console.log(
    "\nGoogle only returns a refresh token on first consent. Remove this app at"
  );
  console.log("https://myaccount.google.com/permissions and run this again.");
}

console.log("\nLocations you manage (pick one for GOOGLE_BUSINESS_LOCATION):");
await listLocations(tokens.access_token);
