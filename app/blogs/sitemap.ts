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

  const blogs = await prisma.blog.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${NEXT_PUBLIC_URL}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency,
  }));

  return [
    // {
    //   url: `${NEXT_PUBLIC_URL}/blogs`,
    //   lastModified: new Date(),
    //   changeFrequency,
    // },
    ...blogRoutes,
  ];
}
