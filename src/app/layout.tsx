import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Kishori Vatika", template: "%s - Kishori Vatika" },
  description:
    "Elegant resort with five room categories, dining, pool, and event spaces.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kishori Vatika",
    title: "Kishori Vatika",
    description:
      "Elegant resort with five room categories, dining, pool, and event spaces.",
    images: [{ url: "/hero-hotel.svg", width: 1200, height: 800, alt: "Kishori Vatika" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishori Vatika",
    description:
      "Elegant resort with five room categories, dining, pool, and event spaces.",
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
