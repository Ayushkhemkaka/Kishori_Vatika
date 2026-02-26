import Link from "next/link";
import Image from "next/image";
import { PageViewTracker } from "../_layout/components/PageViewTracker";
import { ThemeToggle } from "../_layout/components/ThemeToggle";
import { NewsletterSignup } from "../_layout/components/NewsletterSignup";
function MarketingLayout({ children }) {
  return <div className="min-h-screen text-stone-900">
    <PageViewTracker />
    <header className="border-b border-emerald-200/60 bg-white/80 backdrop-blur">
      <div className="kv-container hidden items-center justify-between gap-6 py-4 lg:flex">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Image
            src="/logo.png"
            alt="KiSHORi VATiKA logo"
            width={44}
            height={44}
            className="h-14 w-14 shrink-0 object-contain"
            priority
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-2xl font-semibold tracking-[0.07em] text-emerald-800/80 font-display">
              <span className="font-forte">KiSHORi VATiKA</span>
            </div>
            <div className="text-sm text-stone-500">Resorts & Restaurant</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-base font-medium text-stone-700 sm:flex">
          <Link href="/" className="transition-colors hover:text-emerald-700">
            Home
          </Link>
          <Link href="/facilities" className="transition-colors hover:text-emerald-700">
            Facilities
          </Link>
          <Link href="/rooms" className="transition-colors hover:text-emerald-700">
            Rooms
          </Link>
          <Link href="/offers" className="transition-colors hover:text-emerald-700">
            Offers
          </Link>
          <Link href="/about" className="transition-colors hover:text-emerald-700">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-emerald-700">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/enquiry"
            className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
          >
            Enquire now
          </Link>
        </div>
      </div>

      <div className="kv-container hidden py-3 sm:block lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="KiSHORi VATiKA logo"
              width={40}
              height={40}
              className="h-12 w-12 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xl font-semibold tracking-[0.07em] text-emerald-800/80 font-display">
                <span className="font-forte">KiSHORi VATiKA</span>
              </div>
              <div className="text-xs text-stone-500">Resorts & Restaurant</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/enquiry"
              className="inline-flex rounded-full bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
            >
              Enquire now
            </Link>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-emerald-200/60 pt-3 text-base font-medium text-stone-700">
          <Link href="/" className="transition-colors hover:text-emerald-700">
            Home
          </Link>
          <Link href="/facilities" className="transition-colors hover:text-emerald-700">
            Facilities
          </Link>
          <Link href="/rooms" className="transition-colors hover:text-emerald-700">
            Rooms
          </Link>
          <Link href="/offers" className="transition-colors hover:text-emerald-700">
            Offers
          </Link>
          <Link href="/about" className="transition-colors hover:text-emerald-700">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-emerald-700">
            Contact
          </Link>
        </nav>
      </div>

      <div className="border-t border-emerald-200/60 pb-4 pt-3 sm:hidden">
        <div className="kv-container">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image
              src="/logo.png"
              alt="KiSHORi VATiKA logo"
              width={36}
              height={36}
              className="h-10 w-10 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-lg font-semibold tracking-[0.07em] text-emerald-800/80 font-display">
                <span className="font-forte">KiSHORi VATiKA</span>
              </div>
              <div className="text-[11px] text-stone-500">Resorts & Restaurant</div>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        <details className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-emerald-800">
            Menu
          </summary>
          <div className="mt-3 grid gap-2 text-sm text-stone-700">
            <Link href="/" className="transition-colors hover:text-emerald-700">
              Home
            </Link>
            <Link href="/offers" className="transition-colors hover:text-emerald-700">
              Offers
            </Link>
            <Link href="/facilities" className="transition-colors hover:text-emerald-700">
              Facilities
            </Link>
            <Link href="/rooms" className="transition-colors hover:text-emerald-700">
              Rooms
            </Link>
            <Link href="/about" className="transition-colors hover:text-emerald-700">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-emerald-700">
              Contact
            </Link>
            <Link
              href="/enquiry"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
            >
              Enquire now
            </Link>
          </div>
        </details>
        </div>
      </div>
    </header>

    <main className="kv-container pb-16 pt-8 sm:pt-14">
      {children}
    </main>

    <footer className="border-t border-emerald-200/60 bg-white/80">
      <div className="kv-container flex flex-col gap-6 py-6 text-sm text-stone-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">
            (c) {(/* @__PURE__ */ new Date()).getFullYear()} <span className="font-forte">KiSHORi VATiKA</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4">
            <span className="text-stone-400">resort and event spaces.</span>
            <span className="text-stone-400">Crafted with Next.js and Tailwind.</span>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4">
          <p className="text-sm font-semibold text-emerald-900">
            Stay in the loop
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            Monthly updates on offers, events, and seasonal dining.
          </p>
          <div className="mt-3">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </footer>
  </div>;
}
export default MarketingLayout;
