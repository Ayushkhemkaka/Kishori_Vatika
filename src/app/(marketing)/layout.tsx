import type { ReactNode } from "react";
import Link from "next/link";
import { PageViewTracker } from "@/components/PageViewTracker";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-slate-100">
      <PageViewTracker />
      <header className="border-b border-amber-200/10 bg-stone-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-400 shadow-lg shadow-amber-500/30">
              <span className="text-sm font-semibold text-stone-900">KV</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.25em] text-amber-100/80 font-display">
                Kishori Villa
              </div>
              <div className="text-xs text-slate-400">Boutique Hotel - Since 2024</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 sm:flex">
            <Link href="/" className="transition-colors hover:text-amber-200">
              Home
            </Link>
            <Link
              href="/offers"
              className="transition-colors hover:text-amber-200"
            >
              Offers
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-amber-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-amber-200"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/enquiry"
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-200"
            >
              Enquire now
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-amber-200/10 bg-stone-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kishori Villa. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-slate-500">Boutique hotel and event spaces.</span>
            <span className="text-slate-500">Crafted with Next.js and Tailwind.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
