import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeanutReveal } from "@/src/components/PeanutReveal";
import { Contact } from "@/src/components/sections/Contact";
import { Footer } from "@/src/components/sections/Footer";
import { Gallery } from "@/src/components/sections/Gallery";
import { Hero } from "@/src/components/sections/Hero";
import { Highlights } from "@/src/components/sections/Highlights";
import { InstagramFeed } from "@/src/components/sections/InstagramFeed";
import { Location } from "@/src/components/sections/Location";
import { MenuPreview } from "@/src/components/sections/MenuPreview";
import { NavBar } from "@/src/components/sections/NavBar";
import instagramFeedSnapshot from "@/src/content/instagram-feed.generated.json";
import {
  defaultLocale,
  type Locale,
  getSiteContent,
  isLocale,
  locales
} from "@/src/content/site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const content = getSiteContent(locale);

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    category: "Food and Drink",
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
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: `${content.metadata.url}/${locale}`,
      siteName: content.brand,
      locale: content.metadata.ogLocale,
      type: "website",
      images: [
        {
          url: content.metadata.image,
          width: 1200,
          height: 630,
          alt: content.metadata.imageAlt
        }
      ],
      videos: [
        {
          url: `${content.metadata.url}/assets/peanuts_hero_video.mp4`,
          width: 1280,
          height: 720
        }
      ]
    },
    twitter: {
      site: "@peanutsdenizli",
      creator: "@peanutsdenizli",
      card: "summary_large_image",
      title: content.metadata.title,
      description: content.metadata.description,
      images: [
        {
          url: content.metadata.image,
          alt: content.metadata.imageAlt
        }
      ]
    },
    alternates: {
      canonical: `${content.metadata.url}/${locale}`,
      languages: {
        tr: `${content.metadata.url}/tr`,
        en: `${content.metadata.url}/en`,
        "x-default": `${content.metadata.url}/${defaultLocale}`
      }
    }
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const content = getSiteContent(typedLocale);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "@id": `${content.metadata.url}/#bar`,
    name: content.business.name,
    description: content.metadata.description,
    image: [`${content.metadata.url}${content.metadata.image}`],
    url: `${content.metadata.url}/${typedLocale}`,
    telephone: content.business.phoneTel || content.business.phone,
    email: content.business.email,
    priceRange: "₺₺",
    servesCuisine: ["Pub Food", "Cocktails"],
    acceptsReservations: true,
    hasMenu: content.business.qrMenuUrl,
    sameAs: [content.business.instagram, content.business.googleMapsUrl, content.business.googleReviewUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: content.business.address,
      addressLocality: "Denizli",
      postalCode: "20160",
      addressCountry: "TR"
    },
    openingHoursSpecification: content.location.hours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.open,
      closes: hours.close
    }))
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${content.metadata.url}/#website`,
    url: content.metadata.url,
    name: content.brand,
    inLanguage: typedLocale
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${content.metadata.url}/${typedLocale}#webpage`,
    url: `${content.metadata.url}/${typedLocale}`,
    name: content.metadata.title,
    description: content.metadata.description,
    inLanguage: typedLocale,
    isPartOf: { "@id": `${content.metadata.url}/#website` },
    about: { "@id": `${content.metadata.url}/#bar` },
    primaryImageOfPage: `${content.metadata.url}${content.metadata.image}`
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.brand,
        item: `${content.metadata.url}/${typedLocale}`
      }
    ]
  };

  const instagramPosts =
    Array.isArray(instagramFeedSnapshot.posts) && instagramFeedSnapshot.posts.length > 0
      ? instagramFeedSnapshot.posts
      : content.instagramFeed.posts;
  const instagramSource = instagramFeedSnapshot.source === "synced" ? "synced" : "fallback";

  return (
    <>
      <a
        href="#content"
        className="sr-only absolute left-3 top-3 z-[80] rounded-md bg-midnight-soft px-3 py-2 text-xs text-cream focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-amber"
      >
        {content.ui.skipLink}
      </a>
      <NavBar content={content} locale={typedLocale} />
      <main id="content" className="overflow-x-clip pt-16">
        <Hero content={content} />
        <PeanutReveal content={content} />
        <Highlights content={content} />
        <MenuPreview content={content} />
        <Gallery content={content} />
        <InstagramFeed
          content={content}
          posts={instagramPosts}
          source={instagramSource}
          syncedAt={instagramFeedSnapshot.generatedAt}
        />
        <Location content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = ${JSON.stringify(
            typedLocale
          )};document.documentElement.dataset.locale = ${JSON.stringify(typedLocale)};`
        }}
      />
    </>
  );
}
