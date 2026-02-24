# Kishori Vatika – Hotel Website

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

   - `DATABASE_URL` – PostgreSQL connection string
   - `AUTH_SECRET` – e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` – `http://localhost:3000` in development

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

- **[Neon](https://neon.tech)** – Create a project, copy the connection string (pooled recommended for serverless).
- **[Supabase](https://supabase.com)** – New project → Settings → Database → Connection string (use “Transaction” or “Session” mode; for serverless, pooled is better).
- **[Render](https://render.com)** – Create a PostgreSQL instance, copy Internal/External URL.

Use the **pooled** or **serverless** connection string if the provider offers it (e.g. Neon’s pooled URL with `?sslmode=require`).

### 3. Environment variables on Vercel

In the Vercel project → **Settings → Environment Variables**, add:

| Variable           | Description                    | Example / notes                          |
|--------------------|--------------------------------|------------------------------------------|
| `DATABASE_URL`     | PostgreSQL connection string   | From Neon/Supabase/Render (pooled)       |
| `AUTH_SECRET`      | Secret for auth/sessions       | `openssl rand -base64 32`                |
| `NEXTAUTH_URL`     | Full URL of the deployed app   | `https://your-app.vercel.app`            |

Optional (later):

- `META_*` – For Facebook/Instagram auto-posting.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` – For production-grade rate limiting (otherwise in-memory per-instance limits apply).

### 4. Run migrations in production

Migrations are **not** run automatically on Vercel. Run them once per deployment (or when you change the schema):

**Option A – From your machine (recommended)**

```bash
# Use the same DATABASE_URL as production (copy from Vercel env)
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

**Option B – In Vercel build**

To run migrations on every deploy, add a postinstall or build script. In `package.json`:

```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

Then ensure `DATABASE_URL` is set in Vercel so the build can reach your Postgres. Prefer Option A for clarity and to avoid migration failures blocking builds.

### 5. Deploy

- **First deploy:** Trigger a deploy (e.g. push to `main`). After it succeeds, run `prisma migrate deploy` with the production `DATABASE_URL` if you didn’t add it to the build.
- **Later:** Push to your main branch; Vercel will build and deploy. Run `prisma migrate deploy` when you add or change migrations.

### 6. Post-deploy checks

- Visit the site and submit a test enquiry (`/enquiry`).
- Confirm the enquiry appears in the database (e.g. Prisma Studio with production `DATABASE_URL`, or your admin dashboard).
- If you use owner auth, test login at `/admin/login`.

## Project structure

- `src/app/(marketing)/` – Public pages (home, offers, enquiry, about, contact).
- `src/app/api/` – API routes (e.g. `enquiry`, `analytics/event`) with Zod validation and rate limiting.
- `src/lib/` – DB client (`db`), validation schemas, rate limiting, API response helpers.
- `prisma/` – Schema and migrations.

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
