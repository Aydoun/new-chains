import type { MetadataRoute } from "next";

const SITE_URL = "https://linkntell.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/login", "/privacy", "/terms"],
      disallow: ["/api/", "/studio", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
