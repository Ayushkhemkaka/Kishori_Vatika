import type { ReactNode } from "react";
import { PageViewTracker } from "../_layout/components/PageViewTracker";
import { SiteHeader } from "../_layout/components/SiteHeader";
import { NewsletterSignup } from "../_layout/components/NewsletterSignup";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-stone-900">
      <PageViewTracker />
      <SiteHeader />

      <main className="kv-container pb-16 pt-8 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-emerald-200/60 bg-white/80">
        <div className="kv-container flex flex-col gap-6 py-6 text-sm text-stone-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              (c) {new Date().getFullYear()} <span className="font-forte">KiSHORi VATiKA</span>. All rights reserved.
            </p>
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
    </div>
  );
}
