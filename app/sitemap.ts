import type { MetadataRoute } from "next";
import { defaultLocale, getSiteContent, locales } from "@/src/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const content = getSiteContent(defaultLocale);
  const now = new Date();

  return locales.map((locale) => ({
    url: `${content.metadata.url}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: {
      languages: {
        tr: `${content.metadata.url}/tr`,
        en: `${content.metadata.url}/en`
      }
    }
  }));
}
