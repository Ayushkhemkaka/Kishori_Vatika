# KiSHORi VATiKA â€“ Hotel Website

A production-ready hotel website built with Next.js: customer-facing pages for rooms and offers, enquiry form, and an owner dashboard (auth, offers, enquiries, analytics). Uses PostgreSQL (Prisma), validation (Zod), rate limiting, and optional Meta (Facebook/Instagram) auto-posting.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or a managed provider)

### Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set at least:

   - `DATABASE_URL` â€“ PostgreSQL connection string
   - `AUTH_SECRET` â€“ e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` â€“ `http://localhost:3000` in development

3. **Database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   # Optional: seed an owner user and sample data
   # npx prisma db seed
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel + Managed Postgres)

### 1. Hosting (Vercel)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Framework preset: **Next.js**. Root directory: project root. Build command: `npm run build` (default). No need to change Output Directory.
4. Do **not** add env vars in the UI yet; add them after creating the database.

### 2. Managed PostgreSQL

Use one of these (or any Postgres host):

- **[Neon](https://neon.tech)** â€“ Create a project, copy the connection string (pooled recommended for serverless).
- **[PlanetScale](https://planetscale.com)** â€“ Create a MySQL database and copy connection details.
- **[Render](https://render.com)** â€“ Create a PostgreSQL instance, copy Internal/External URL.

Use the **pooled** or **serverless** connection string if the provider offers it (e.g. Neonâ€™s pooled URL with `?sslmode=require`).

### 3. Environment variables on Vercel

In the Vercel project â†’ **Settings â†’ Environment Variables**, add:

| Variable           | Description                    | Example / notes                          |
|--------------------|--------------------------------|------------------------------------------|
| `DATABASE_URL`     | MySQL connection string        | From your MySQL provider                  |
| `AUTH_SECRET`      | Secret for auth/sessions       | `openssl rand -base64 32`                |
| `NEXTAUTH_URL`     | Full URL of the deployed app   | `https://your-app.vercel.app`            |

Optional (later):

- `META_*` â€“ For Facebook/Instagram auto-posting.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` â€“ For production-grade rate limiting (otherwise in-memory per-instance limits apply).
- `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME`, `BREVO_TO_EMAIL` â€“ For enquiry/contact notification emails.

### 4. Run migrations in production

Migrations are **not** run automatically on Vercel. Run them once per deployment (or when you change the schema):

**Option A â€“ From your machine (recommended)**

```bash
# Use the same DATABASE_URL as production (copy from Vercel env)
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

**Option B â€“ In Vercel build**

To run migrations on every deploy, add a postinstall or build script. In `package.json`:

```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

Then ensure `DATABASE_URL` is set in Vercel so the build can reach your Postgres. Prefer Option A for clarity and to avoid migration failures blocking builds.

### 5. Deploy

- **First deploy:** Trigger a deploy (e.g. push to `main`). After it succeeds, run `prisma migrate deploy` with the production `DATABASE_URL` if you didnâ€™t add it to the build.
- **Later:** Push to your main branch; Vercel will build and deploy. Run `prisma migrate deploy` when you add or change migrations.

### 6. Post-deploy checks

- Visit the site and submit a test enquiry (`/enquiry`).
- Confirm the enquiry appears in the database (e.g. Prisma Studio with production `DATABASE_URL`, or your admin dashboard).
- Confirm the notification email arrives at `BREVO_TO_EMAIL`.
- If you use owner auth, test login at `/admin/login`.

## Routes overview

### Public pages

- `GET /` - Landing page with hero, featured offers, and primary call-to-actions.
- `GET /about` - Hotel story, value proposition, and brand details.
- `GET /contact` - Contact information and contact form entry point.
- `GET /offers` - Active offers listing page.
- `GET /offers/[id]` - Offer detail page with targeted enquiry CTA.
- `GET /enquiry` - Enquiry form page (supports offer prefill via query string).

### Admin pages

- `GET /admin` - Admin dashboard summary (visits, enquiries, offers).
- `GET /admin/login` - Owner login page for admin access.
- `GET /admin/offers` - Offer management list view.
- `GET /admin/offers/new` - Create a new offer.
- `GET /admin/offers/[id]/edit` - Edit an existing offer.
- `GET /admin/enquiries` - Enquiry management and status updates.
- `GET /admin/analytics` - Analytics dashboard and charts.
- `GET /admin/social` - Social account connect/manage page.

### API routes

- `POST /api/enquiry` - Create a new enquiry with validation and rate limiting.
- `POST /api/contact` - Submit contact form message.
- `POST /api/newsletter` - Add an email to newsletter signup list.
- `POST /api/preferences` - Save client/user preference values.
- `POST /api/analytics/event` - Record analytics events (page view, click, enquiry submitted).
- `GET /api/social/accounts` - Fetch connected social accounts for admin.
- `GET /api/social/connect` - Fetch social account connection status.
- `POST /api/social/connect` - Connect or update Facebook/Instagram credentials.
- `POST /api/social/publish-offer` - Publish an offer to connected social platforms.
- `GET /api/admin/offers` - Admin-only offers listing with features/publications.
- `POST /api/admin/offers` - Admin-only offer creation endpoint.
- `GET /api/admin/offers/[id]` - Admin-only offer detail endpoint.
- `PATCH /api/admin/offers/[id]` - Admin-only offer update endpoint.
- `PATCH /api/admin/enquiries/[id]` - Admin-only enquiry status update endpoint.
- `GET|POST /api/auth/[...nextauth]` - NextAuth handler for credentials auth/session flows.

## `src` file structure (one-line map)

- `src/auth.ts` - Exposes NextAuth helpers and auth wiring used across server code.
- `src/auth.config.ts` - Credentials provider config, session/jwt callbacks, and sign-in page mapping.
- `src/middleware.ts` - Request middleware for admin protection and analytics session cookie handling.
- `src/app/layout.tsx` - Root app layout wrapping all route groups.
- `src/app/globals.css` - Global styles and shared Tailwind/CSS rules.
- `src/app/providers.tsx` - Global React providers used by the app tree.
- `src/app/manifest.ts` - PWA manifest metadata.
- `src/app/robots.ts` - Robots rules for crawlers.
- `src/app/sitemap.ts` - Sitemap route generation for public URLs.
- `src/app/favicon.ico` - Site favicon asset.

- `src/app/(site)/(marketing)/layout.tsx` - Marketing-site shell (header/footer/nav).
- `src/app/(site)/(marketing)/page.tsx` - Home page content.
- `src/app/(site)/(marketing)/about/page.tsx` - About page content.
- `src/app/(site)/(marketing)/contact/page.tsx` - Contact page content and form integration.
- `src/app/(site)/(marketing)/contact/components/ContactForm.tsx` - Client contact form component.
- `src/app/(site)/(marketing)/enquiry/page.tsx` - Client enquiry form page.
- `src/app/(site)/(marketing)/offers/page.tsx` - Offers listing page.
- `src/app/(site)/(marketing)/offers/[id]/page.tsx` - Offer details page.
- `src/app/(site)/(marketing)/offers/[id]/OfferClickLogger.tsx` - Client analytics tracker for offer clicks.
- `src/app/(site)/_layout/components/NewsletterSignup.tsx` - Newsletter signup UI + API call.
- `src/app/(site)/_layout/components/PageViewTracker.tsx` - Client page-view event sender.
- `src/app/(site)/_layout/components/ThemeToggle.tsx` - Client theme preference toggle.
- `src/app/(site)/_shared/hooks/useAnalytics.ts` - Shared client analytics helper hook.

- `src/app/admin/layout.tsx` - Admin shell (nav, sign-out, protected area layout).
- `src/app/admin/page.tsx` - Admin dashboard page.
- `src/app/admin/login/page.tsx` - Admin login page.
- `src/app/admin/analytics/page.tsx` - Admin analytics page.
- `src/app/admin/analytics/components/AnalyticsCharts.tsx` - Admin analytics chart components.
- `src/app/admin/enquiries/page.tsx` - Admin enquiries list and pagination.
- `src/app/admin/enquiries/components/EnquiryStatusSelect.tsx` - Client control for enquiry status updates.
- `src/app/admin/offers/page.tsx` - Admin offers list page.
- `src/app/admin/offers/new/page.tsx` - New offer page.
- `src/app/admin/offers/[id]/edit/page.tsx` - Edit offer page.
- `src/app/admin/offers/components/OfferForm.tsx` - Shared client offer create/edit form.
- `src/app/admin/social/page.tsx` - Admin social accounts page.
- `src/app/admin/social/components/SocialConnectForm.tsx` - Social account connect/update form.
- `src/app/admin/components/AdminSignOut.tsx` - Admin sign-out action component.

- `src/app/(shared)/api/auth/[...nextauth]/route.ts` - NextAuth API route handler.
- `src/app/(shared)/api/enquiry/route.ts` - Enquiry create API endpoint.
- `src/app/(shared)/api/contact/route.ts` - Contact message API endpoint.
- `src/app/(shared)/api/newsletter/route.ts` - Newsletter signup API endpoint.
- `src/app/(shared)/api/preferences/route.ts` - User preference API endpoint.
- `src/app/(shared)/api/analytics/event/route.ts` - Analytics event ingest API endpoint.
- `src/app/(shared)/api/social/accounts/route.ts` - Connected social accounts API endpoint.
- `src/app/(shared)/api/social/connect/route.ts` - Social connect/update API endpoint.
- `src/app/(shared)/api/social/publish-offer/route.ts` - Offer publish-to-social API endpoint.
- `src/app/(shared)/api/admin/offers/route.ts` - Admin offers list/create API endpoint.
- `src/app/(shared)/api/admin/offers/[id]/route.ts` - Admin offer detail/update API endpoint.
- `src/app/(shared)/api/admin/enquiries/[id]/route.ts` - Admin enquiry status update API endpoint.

- `src/app/(shared)/lib/db.js` - Prisma database client setup.
- `src/app/(shared)/lib/rate-limit.ts` - Rate-limit utilities for API protection.
- `src/app/(shared)/lib/api-response.ts` - Standardized JSON/error response helpers.
- `src/app/(shared)/lib/analytics.ts` - Analytics constants/helpers (including session cookie key).
- `src/app/(shared)/lib/audit.ts` - Admin activity/error audit log helpers.
- `src/app/(shared)/lib/auth-password.ts` - Password hashing/verification helpers.
- `src/app/(shared)/lib/meta-graph.ts` - Helpers for Meta/Facebook graph integrations.
- `src/app/(shared)/lib/validation/enquiry.ts` - Zod schema for enquiry API payloads.
- `src/app/(shared)/lib/validation/analytics.ts` - Zod schema for analytics payloads.
- `src/app/(shared)/lib/__tests__/enquiry.test.ts` - Validation unit tests for enquiry flow.
- `src/app/(shared)/types/next-auth.d.ts` - NextAuth type augmentation for custom session/jwt fields.
## Validation and error handling

- **Enquiry API** (`POST /api/enquiry`): Body validated with Zod (`createEnquirySchema`). Returns 400 with field errors on validation failure, 429 when rate limited, 500 on server errors.
- **Analytics API** (`POST /api/analytics/event`): Body validated with Zod (`analyticsEventSchema`). Same status codes and behaviour.

Public APIs are rate-limited per client identifier (IP or `x-forwarded-for` / `x-real-ip`) to reduce abuse.

## Tests

Minimal tests for validation and critical paths:

```bash
npm test
```

Uses Vitest. See `src/lib/__tests__/` for enquiry validation and related tests.

## License

Private / as per your project.

