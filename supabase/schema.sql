create extension if not exists pgcrypto;

-- Enums from Prisma schema
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'OWNER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'BOOKED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "SocialPlatform" AS ENUM ('FACEBOOK', 'INSTAGRAM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PublicationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AnalyticsType" AS ENUM ('PAGE_VIEW', 'OFFER_CLICK', 'ENQUIRY_SUBMITTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Core auth / domain tables
create table if not exists "User" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  email text not null,
  name text,
  password text,
  role "UserRole" not null default 'CUSTOMER',
  "createdAt" timestamptz not null default now(),
  "lastVisitAt" timestamptz
);

create unique index if not exists "User_email_key" on "User" (email);

create table if not exists "Offer" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  title text not null,
  description text not null,
  price numeric(65,30) not null,
  "validFrom" timestamptz not null,
  "validTo" timestamptz not null,
  "isActive" boolean not null default true,
  "heroImageUrl" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Enquiry" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  "checkIn" timestamptz not null,
  "checkOut" timestamptz not null,
  guests integer not null,
  source text not null default 'website',
  status "EnquiryStatus" not null default 'NEW',
  "createdAt" timestamptz not null default now(),
  "offerId" text references "Offer"(id) on delete set null on update cascade,
  "userId" text references "User"(id) on delete set null on update cascade
);

create table if not exists "Visit" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  "userId" text references "User"(id) on delete set null on update cascade,
  "sessionId" text not null,
  ip text,
  "userAgent" text,
  path text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists "OfferFeature" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  label text not null,
  value text not null,
  "offerId" text not null references "Offer"(id) on delete cascade on update cascade
);

create table if not exists "SocialAccount" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  platform "SocialPlatform" not null,
  "pageId" text,
  "accountId" text,
  "accessToken" text not null,
  "refreshToken" text,
  "expiresAt" timestamptz,
  "createdAt" timestamptz not null default now()
);

create unique index if not exists "SocialAccount_platform_key" on "SocialAccount" (platform);

create table if not exists "OfferPublication" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  "offerId" text not null references "Offer"(id) on delete cascade on update cascade,
  platform "SocialPlatform" not null,
  status "PublicationStatus" not null default 'PENDING',
  "externalPostId" text,
  "errorMessage" text,
  "createdAt" timestamptz not null default now(),
  "socialAccountId" text references "SocialAccount"(id) on delete set null on update cascade
);

create table if not exists "AnalyticsEvent" (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  type "AnalyticsType" not null,
  "userId" text references "User"(id) on delete set null on update cascade,
  "sessionId" text not null,
  "offerId" text references "Offer"(id) on delete set null on update cascade,
  path text,
  metadata jsonb,
  "createdAt" timestamptz not null default now()
);

-- Operational / tracking tables used by API
create table if not exists "Visitor" (
  id uuid primary key default gen_random_uuid(),
  "sessionId" text not null unique,
  ip text,
  "userAgent" text,
  "firstSeenAt" timestamptz not null default now(),
  "lastSeenAt" timestamptz not null default now(),
  "lastPath" text
);

create table if not exists "UserPreference" (
  id uuid primary key default gen_random_uuid(),
  "sessionId" text not null,
  key text not null,
  value text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("sessionId", key)
);

create table if not exists "ContactMessage" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text default 'website',
  path text,
  "sessionId" text,
  ip text,
  "userAgent" text,
  "createdAt" timestamptz not null default now()
);

create table if not exists "NewsletterSignup" (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'website',
  "sessionId" text,
  "createdAt" timestamptz not null default now()
);

create table if not exists "AdminActivity" (
  id uuid primary key default gen_random_uuid(),
  "adminId" text,
  action text not null,
  entity text,
  "entityId" text,
  metadata jsonb,
  "createdAt" timestamptz not null default now()
);

create table if not exists "ErrorLog" (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'error',
  message text not null,
  stack text,
  path text,
  context jsonb,
  "createdAt" timestamptz not null default now()
);

-- Indexes
create index if not exists "Visit_createdAt_idx" on "Visit" ("createdAt");
create index if not exists "Visit_sessionId_idx" on "Visit" ("sessionId");

create index if not exists "Enquiry_createdAt_idx" on "Enquiry" ("createdAt");
create index if not exists "Enquiry_offerId_idx" on "Enquiry" ("offerId");
create index if not exists "Enquiry_status_createdAt_idx" on "Enquiry" (status, "createdAt");

create index if not exists "Offer_createdAt_idx" on "Offer" ("createdAt");
create index if not exists "Offer_isActive_validFrom_validTo_idx" on "Offer" ("isActive", "validFrom", "validTo");

create index if not exists "OfferPublication_offerId_createdAt_idx" on "OfferPublication" ("offerId", "createdAt");
create index if not exists "OfferPublication_platform_createdAt_idx" on "OfferPublication" (platform, "createdAt");

create index if not exists "AnalyticsEvent_createdAt_idx" on "AnalyticsEvent" ("createdAt");
create index if not exists "AnalyticsEvent_type_createdAt_idx" on "AnalyticsEvent" (type, "createdAt");
create index if not exists "AnalyticsEvent_offerId_createdAt_idx" on "AnalyticsEvent" ("offerId", "createdAt");
create index if not exists "AnalyticsEvent_sessionId_createdAt_idx" on "AnalyticsEvent" ("sessionId", "createdAt");

create index if not exists "Visitor_lastSeenAt_idx" on "Visitor" ("lastSeenAt");
create index if not exists "ContactMessage_createdAt_idx" on "ContactMessage" ("createdAt");
create index if not exists "AdminActivity_createdAt_idx" on "AdminActivity" ("createdAt");
create index if not exists "ErrorLog_createdAt_idx" on "ErrorLog" ("createdAt");

-- Keep Offer.updatedAt fresh for direct SQL/Supabase updates
create or replace function set_offer_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_offer_updated_at_trigger on "Offer";
create trigger set_offer_updated_at_trigger
before update on "Offer"
for each row
execute function set_offer_updated_at();
