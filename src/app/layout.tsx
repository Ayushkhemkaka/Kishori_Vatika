import type { Metadata } from "next";
import { Cinzel, Italiana, Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Engraved Roman serif for headings. Cinzel is drawn from classical
// inscriptions, which is why it reads as carved rather than printed - the
// note a hotel wordmark wants under it.
const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// A single very fine display cut, reserved for the largest titles. At hero
// size its hairline strokes are the whole effect; anywhere smaller it just
// looks faint, so it is never used below 3xl.
const accent = Italiana({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Body copy and the tracked uppercase labels. The site leans hard on small
// tracked caps ("WHAT TO EXPECT", "BEST FOR", the nav), and Montserrat is
// drawn from old signage lettering - wide, even, and built for exactly that,
// with a full weight range so 500 and 600 are real cuts rather than
// synthesised ones.
const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Kishori Vatika", template: "%s - Kishori Vatika" },
  description:
    "Elegant boutique hotel with five room categories, dining, pool, and event spaces.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kishori Vatika",
    title: "Kishori Vatika",
    description:
      "Elegant boutique hotel with five room categories, dining, pool, and event spaces.",
    images: [{ url: "/hero-hotel.svg", width: 1200, height: 800, alt: "Kishori Vatika" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishori Vatika",
    description:
      "Elegant boutique hotel with five room categories, dining, pool, and event spaces.",
    images: ["/hero-hotel.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${display.variable} ${accent.variable} ${body.variable} antialiased`}>
        {/* Scroll reveals start at opacity 0 and are switched on by script.
            Without this, a visitor with JavaScript off would meet a page of
            blank sections. */}
        <noscript>
          <style>{".kv-reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
