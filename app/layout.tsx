import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Marcellus } from "next/font/google";
import "./globals.css";

const title = "Hayati — A Fairytale of the Two Kingdoms";
const description = "A cinematic fairytale of two distant kingdoms, a magical realm, and a love that waits for the day distance finally becomes touch. Read the story and download the ebook.";
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://hayati-40o2q0k1k-smarderve-s-projects.vercel.app";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Hayati",
    url: "/",
    images: [{ url: "/og/hayati-og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/hayati-og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050407",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${marcellus.variable}`}>
      <body>{children}</body>
    </html>
  );
}
