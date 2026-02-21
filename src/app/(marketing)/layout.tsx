import type { ReactNode } from "react";
import Link from "next/link";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ThemeToggle } from "./_components/ThemeToggle";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50/60 to-white text-stone-900">
      <PageViewTracker />
      <header className="border-b border-emerald-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-emerald-300 shadow-md shadow-emerald-200/60">
              <span className="text-sm font-semibold text-stone-900">KV</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.25em] text-emerald-800/80 font-display">
                Kishori Vatika
              </div>
              <div className="text-xs text-stone-500">Boutique Hotel - Since 2024</div>
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/enquiry"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-500"
            >
              Enquire now
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-emerald-200/60 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} Kishori Vatika. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-stone-400">Boutique hotel and event spaces.</span>
            <span className="text-stone-400">Crafted with Next.js and Tailwind.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
