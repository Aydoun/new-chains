import type { MetadataRoute } from "next";

const SITE_URL = "https://linkntell.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/login", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
  }));
}
