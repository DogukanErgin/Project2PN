import type { MetadataRoute } from "next";
import { defaultLocale, getSiteContent } from "@/src/content/site";

export default function manifest(): MetadataRoute.Manifest {
  const content = getSiteContent(defaultLocale);

  return {
    name: content.brand,
    short_name: content.brand,
    description: content.metadata.description,
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#0b0a08",
    theme_color: "#0b0a08",
    lang: defaultLocale,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
