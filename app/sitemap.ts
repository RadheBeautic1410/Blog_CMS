import { MetadataRoute } from "next";
import { NEXT_PUBLIC_URL } from "./constants/env";
import { prisma } from "@/lib/prisma";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const changeFrequency: ChangeFrequency = "weekly";

  const staticRoutes: MetadataRoute.Sitemap = ["/page/sitemap.xml", "/blogs/sitemap.xml", "/categories/sitemap.xml"].map((route) => ({
    url: `${NEXT_PUBLIC_URL}${route}`,
    lastModified: new Date(),
    changeFrequency,
  }));

  // const blogs = await prisma.blog.findMany({
  //   where: { status: "published" },
  //   select: { slug: true, updatedAt: true },
  //   orderBy: { updatedAt: "desc" },
  // });

  // const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
  //   url: `${NEXT_PUBLIC_URL}/blogs/${blog.slug}`,
  //   lastModified: blog.updatedAt,
  //   changeFrequency,
  // }));

  return [...staticRoutes];
}