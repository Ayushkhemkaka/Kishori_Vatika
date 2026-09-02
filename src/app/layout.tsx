import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// High-contrast old-style serif for headings; its lighter cuts are what give
// the pages their elegance, so the weights stop at 500.
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Geometric sans for body copy and the tracked uppercase labels.
const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
