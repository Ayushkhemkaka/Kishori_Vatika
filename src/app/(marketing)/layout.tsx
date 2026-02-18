import type { ReactNode } from "react";
import Link from "next/link";
import { PageViewTracker } from "@/components/PageViewTracker";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <PageViewTracker />
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shadow-lg shadow-amber-500/40" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.25em] text-amber-200/80">
                Kishori VILLA
              </div>
              <div className="text-xs text-slate-300/80">
                Boutique Stay · Since 2024
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 sm:flex">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              Home
            </Link>
            <Link
              href="/offers"
              className="hover:text-amber-200 transition-colors"
            >
              Offers
            </Link>
            <Link
              href="/about"
              className="hover:text-amber-200 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-amber-200 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/enquiry"
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 transition hover:bg-amber-300"
            >
              Enquire now
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kishori Villa. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-slate-500">Boutique hotel in the hills.</span>
            <span className="text-slate-500">Crafted with Next.js & Tailwind.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

