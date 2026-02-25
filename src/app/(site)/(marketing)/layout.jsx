import Link from "next/link";
import { PageViewTracker } from "../_layout/components/PageViewTracker";
import { ThemeToggle } from "../_layout/components/ThemeToggle";
import { NewsletterSignup } from "../_layout/components/NewsletterSignup";
function MarketingLayout({ children }) {
  return <div className="min-h-screen text-stone-900">
      <PageViewTracker />
      <header className="border-b border-emerald-200/60 bg-white/80 backdrop-blur">
        <div className="kv-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-emerald-300 shadow-md shadow-emerald-200/60">
              <span className="text-sm font-semibold text-stone-900">KV</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.25em] text-emerald-800/80 font-display">
                Kishori Vatika
              </div>
              <div className="text-xs text-stone-500">Resort - Since 2024</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 sm:flex">
            <Link href="/" className="transition-colors hover:text-emerald-700">
              Home
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
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
    href="/enquiry"
    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
  >
              Enquire now
            </Link>
          </div>
        </div>
        <div className="border-t border-emerald-200/60 px-4 pb-4 pt-3 sm:hidden">
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
              <Link href="/about" className="transition-colors hover:text-emerald-700">
                About
              </Link>
              <Link href="/contact" className="transition-colors hover:text-emerald-700">
                Contact
              </Link>
            </div>
          </details>
        </div>
      </header>

      <main className="kv-container pb-16 pt-8 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-emerald-200/60 bg-white/80">
        <div className="kv-container flex flex-col gap-6 py-6 text-sm text-stone-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>(c) {(/* @__PURE__ */ new Date()).getFullYear()} Kishori Vatika. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
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
