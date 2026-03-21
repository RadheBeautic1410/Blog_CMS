import { MetadataRoute } from "next";
import { NEXT_PUBLIC_URL } from "../constants/env";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const changeFrequency: ChangeFrequency = "daily";
  const staticRoutes = ["", "/page", "/categories", "/blog"].map((route) => ({
    url: `${NEXT_PUBLIC_URL}${route}`,
    // lastModified: new Date().toISOString(),
    // changeFrequency,
  }));

  return [...staticRoutes];
}
