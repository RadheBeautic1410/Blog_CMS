import { prisma } from "@/lib/prisma";
import { NEXT_PUBLIC_URL } from "../constants/env";
import { MetadataRoute } from "next";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "never";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const changeFrequency: ChangeFrequency = "weekly";

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${NEXT_PUBLIC_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency,
  }));

  return [
    {
      url: `${NEXT_PUBLIC_URL}/categories`,
      lastModified: new Date(),
      changeFrequency,
    },
    ...categoryRoutes,
  ];
}
