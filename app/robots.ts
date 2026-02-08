import type { MetadataRoute } from "next";
import { getSiteContent, defaultLocale } from "@/src/content/site";

export default function robots(): MetadataRoute.Robots {
  const content = getSiteContent(defaultLocale);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: `${content.metadata.url}/sitemap.xml`,
    host: content.metadata.url
  };
}
