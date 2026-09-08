import type { ReactNode } from "react";
import Link from "next/link";
import { PageViewTracker } from "../_layout/components/PageViewTracker";
import { SiteHeader } from "../_layout/components/SiteHeader";
import { NewsletterSignup } from "../_layout/components/NewsletterSignup";
import { footer, site } from "@/content/site-content";

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
      {children}
    </h2>
  );
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const { contact } = footer;

  return (
    <div className="min-h-screen text-stone-900">
      <PageViewTracker />
      <SiteHeader />

      <main className="kv-container pb-12 pt-6 sm:pt-9">
        {children}
      </main>

      {/* Four columns of substance over a thin legal bar, the shape most
          hotel sites settle on: who we are, where to go, how to reach us,
          and the practical stay details a guest checks before booking. */}
      <footer className="border-t border-emerald-200/60 bg-white/80">
        <div className="kv-container py-9 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <div className="space-y-4">
              <p className="font-forte kv-wordmark text-2xl">{site.name}</p>
              <p className="max-w-sm text-sm leading-relaxed text-stone-600">
                {footer.about}
              </p>
              <Link
                href={footer.bookCta.href}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-emerald-500"
              >
                {footer.bookCta.label}
              </Link>

              {footer.socials.length > 0 ? (
                <div className="flex flex-wrap gap-4 pt-1 text-sm text-stone-600">
                  {footer.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="transition hover:text-emerald-700"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <nav className="space-y-3" aria-label="Footer">
              <ColumnTitle>{footer.explore.title}</ColumnTitle>
              <ul className="space-y-2 text-sm text-stone-600">
                {footer.explore.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-emerald-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3">
              <ColumnTitle>{contact.title}</ColumnTitle>
              <address className="space-y-1.5 text-sm not-italic leading-relaxed text-stone-600">
                {contact.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {/* Each channel appears only once it has a value, so an
                    unfilled field leaves no empty row or dead link. */}
                {contact.phone ? (
                  <p>
                    <a
                      href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                      className="transition hover:text-emerald-700"
                    >
                      {contact.phone}
                    </a>
                  </p>
                ) : null}
                {contact.whatsapp ? (
                  <p>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="transition hover:text-emerald-700"
                    >
                      WhatsApp: {contact.whatsapp}
                    </a>
                  </p>
                ) : null}
                {contact.email ? (
                  <p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition hover:text-emerald-700"
                    >
                      {contact.email}
                    </a>
                  </p>
                ) : null}
              </address>
              <p className="text-sm text-stone-500">
                <span className="text-stone-600">{contact.hoursLabel}:</span>{" "}
                {contact.hours}
              </p>
            </div>

            <div className="space-y-3">
              <ColumnTitle>{footer.stay.title}</ColumnTitle>
              <dl className="space-y-2 text-sm text-stone-600">
                {footer.stay.items.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <dt className="text-stone-500">{item.label}</dt>
                    <dd className="text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* One row, not a panel: the label and the field sit on the same
              line from `lg` up, so the strip costs a single line of height. */}
          <div className="mt-8 flex flex-col gap-3 border-t border-emerald-100 pt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-900">
                {footer.newsletter.title}
              </p>
              <p className="text-sm text-stone-600">
                {footer.newsletter.description}
              </p>
            </div>
            <div className="shrink-0">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-100">
          <div className="kv-container flex flex-col gap-1.5 py-4 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-forte">{site.name}</span>. {footer.rights}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span>{footer.tagline}</span>
              <span className="text-stone-400">{footer.credit}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
