"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * On the home page the header floats over the photo banner: it is taken out of
 * the flow so the banner starts at the very top of the page, and it is drawn
 * transparent with light text.
 *
 * Once the banner has scrolled past, the header swaps to the normal solid bar
 * so the links stay readable over ordinary page content. Every other route
 * keeps the solid header at all times.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    // Solidify a little before the banner fully clears, so the swap happens
    // while the header is still over the photo rather than over white.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled;

  return (
    <header
      className={
        isHome
          ? `fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
              overlay
                ? "border-b border-transparent bg-transparent"
                : "border-b border-emerald-200/60 bg-white/80 backdrop-blur"
            }`
          : "sticky top-0 z-50 border-b border-emerald-200/60 bg-white/80 backdrop-blur"
      }
    >
      <div className="kv-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Kishori Vatika resort logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <div className="leading-tight">
            <div
              className={`text-xl font-semibold tracking-[0.06em] font-display font-forte ${
                overlay ? "text-white drop-shadow" : "text-black"
              }`}
            >
              KiSHORi VATiKA
            </div>
            <div
              className={`text-xs ${
                overlay ? "text-white/80 drop-shadow" : "text-stone-500"
              }`}
            >
              Resort - Since 2024
            </div>
          </div>
        </Link>

        <nav
          className={`hidden items-center gap-6 text-sm font-medium sm:flex ${
            overlay ? "text-white drop-shadow" : "text-stone-700"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                overlay ? "hover:text-emerald-200" : "hover:text-emerald-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
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

      <div
        className={`border-t px-4 pb-4 pt-3 sm:hidden ${
          overlay ? "border-white/25" : "border-emerald-200/60"
        }`}
      >
        <details
          className={`rounded-xl border px-4 py-3 ${
            overlay
              ? "border-white/30 bg-black/30 backdrop-blur"
              : "border-emerald-100 bg-white/80"
          }`}
        >
          <summary
            className={`cursor-pointer text-sm font-semibold ${
              overlay ? "text-white" : "text-emerald-800"
            }`}
          >
            Menu
          </summary>
          <div
            className={`mt-3 grid gap-2 text-sm ${
              overlay ? "text-white/90" : "text-stone-700"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  overlay ? "hover:text-emerald-200" : "hover:text-emerald-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
