import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";
import { BrandFontAutoApply } from "./(shared)/components/BrandFontAutoApply";
import "./globals.css";
const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"]
});
const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"]
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5002";
const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "KiSHORi VATiKA", template: "%s - KiSHORi VATiKA" },
  description: "Elegant resort with five room categories, dining, pool, and event spaces.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "KiSHORi VATiKA",
    title: "KiSHORi VATiKA",
    description: "Elegant resort with five room categories, dining, pool, and event spaces.",
    images: [{ url: "/hero-hotel.jpg", width: 1200, height: 800, alt: "KiSHORi VATiKA" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "KiSHORi VATiKA",
    description: "Elegant resort with five room categories, dining, pool, and event spaces.",
    images: ["/hero-hotel.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.ico"
  }
};
function RootLayout({
  children
}) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <BrandFontAutoApply />
        <Providers>{children}</Providers>
      </body>
  </html>;
}
export default RootLayout;
export { metadata };
