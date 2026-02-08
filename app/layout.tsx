import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { defaultLocale, getSiteContent } from "@/src/content/site";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
});

const defaultContent = getSiteContent(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(defaultContent.metadata.url),
  applicationName: defaultContent.brand,
  title: defaultContent.metadata.title,
  description: defaultContent.metadata.description,
  keywords: defaultContent.metadata.keywords,
  category: "Food and Drink",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg" }]
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
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: defaultContent.metadata.title,
    description: defaultContent.metadata.description,
    url: `${defaultContent.metadata.url}/${defaultLocale}`,
    siteName: defaultContent.brand,
    locale: defaultContent.metadata.ogLocale,
    type: "website",
    images: [
      {
        url: defaultContent.metadata.image,
        width: 1200,
        height: 630,
        alt: defaultContent.metadata.imageAlt
      }
    ]
  },
  twitter: {
    site: "@peanutsdenizli",
    creator: "@peanutsdenizli",
    card: "summary_large_image",
    title: defaultContent.metadata.title,
    description: defaultContent.metadata.description,
    images: [
      {
        url: defaultContent.metadata.image,
        alt: defaultContent.metadata.imageAlt
      }
    ]
  },
  alternates: {
    canonical: `${defaultContent.metadata.url}/${defaultLocale}`,
    languages: {
      tr: `${defaultContent.metadata.url}/tr`,
      en: `${defaultContent.metadata.url}/en`,
      "x-default": `${defaultContent.metadata.url}/${defaultLocale}`
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable}`}>
      <body className="bg-midnight text-cream antialiased">{children}</body>
    </html>
  );
}
