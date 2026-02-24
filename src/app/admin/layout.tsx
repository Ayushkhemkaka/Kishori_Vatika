import type { ReactNode } from "react";
import Link from "next/link";
import { AdminSignOut } from "./components/AdminSignOut";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="text-sm font-semibold text-amber-200 hover:text-amber-100"
          >
            Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/offers" className="text-slate-300 hover:text-amber-200">
              Offers
            </Link>
            <Link href="/admin/enquiries" className="text-slate-300 hover:text-amber-200">
              Enquiries
            </Link>
            <Link href="/admin/analytics" className="text-slate-300 hover:text-amber-200">
              Analytics
            </Link>
            <Link href="/admin/social" className="text-slate-300 hover:text-amber-200">
              Social
            </Link>
            <Link href="/" className="text-slate-400 hover:text-slate-200">
              View site →
            </Link>
            <AdminSignOut />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
