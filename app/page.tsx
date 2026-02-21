import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import CategoryMarquee from "@/components/CategoryMarquee";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FlowerIcon } from "@/components/icons";

async function getFeaturedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        featured: true,
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
}

async function getLatestBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Calculate actual blog counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const blogCount = await prisma.blog.count({
          where: {
            category: category.name,
            status: "published",
          },
        });
        return {
          ...category,
          count: blogCount,
        };
      }),
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const [featuredBlogs, latestBlogs, categories] = await Promise.all([
    getFeaturedBlogs(),
    getLatestBlogs(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Featured Blog Section */}
        <section className="relative overflow-hidden py-5 lg:py-10">
          {/* Wavy decorative background */}
          <div
            className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 opacity-30"
            aria-hidden
          >
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full text-violet-200"
            >
              <path
                fill="currentColor"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.1,76.6C26.4,84.2,10,86.8,-6.4,87.6C-22.8,88.4,-39.2,87.4,-54.3,82.1C-69.4,76.8,-83.2,67.2,-91.5,54.6C-99.8,42,-102.6,26.4,-100.8,11.7C-99,-3,-92.6,-16.8,-84.4,-29.1C-76.2,-41.4,-66.2,-52.2,-53.9,-60.4C-41.6,-68.6,-26.9,-74.2,-11.8,-77.2C3.3,-80.2,30.6,-83.6,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute -right-16 top-20 h-64 w-64 opacity-20"
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="h-full w-full text-amber-200">
              <path
                fill="currentColor"
                d="M39.6,-65.2C51.2,-57.4,61.2,-47.1,68.1,-34.9C75,-22.7,78.8,-8.6,78.3,5.7C77.8,20,73,34.5,64.2,46.4C55.4,58.3,42.6,67.6,28.6,73.1C14.6,78.6,-0.6,80.3,-15.2,77.8C-29.8,75.3,-43.8,68.6,-55.2,58.9C-66.6,49.2,-75.4,36.5,-79.6,22.6C-83.8,8.7,-83.4,-6.4,-78.5,-19.8C-73.6,-33.2,-64.2,-44.9,-52.1,-52.8C-40,-60.7,-25.2,-64.8,-10.7,-67.5C3.8,-70.2,28,-73,39.6,-65.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <FlowerIcon className="flower-spin w-12 h-12 text-[#ff2056c4]" aria-hidden />
            </div>
            <div className="mb-14 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                Featured Posts
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Handpicked articles you don&apos;t want to miss
              </p>
            </div>
            {featuredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} featured />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No featured posts available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section className="relative overflow-hidden py-5 lg:py-10 bg-slate-50">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <FlowerIcon className="absolute right-20 top-12 h-20 w-20 fill-indigo-200/30" aria-hidden />
            <FlowerIcon className="absolute left-8 bottom-16 h-16 w-16 fill-violet-200/30" aria-hidden />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <span className="font-display mb-3 inline-block text-sm font-medium uppercase tracking-widest text-indigo-600">
                Fresh content
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Stay updated with our newest content
              </p>
            </div>
            {latestBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {latestBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 py-16 text-center text-gray-500">
                <p>No articles available yet.</p>
              </div>
            )}
            <div className="mt-14 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                View All Blogs
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section - same bg style as Featured Posts */}
        <section className="relative overflow-hidden py-5 lg:py-10">
          {/* Wavy decorative background */}
          <div
            className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 opacity-30"
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="h-full w-full text-emerald-200">
              <path
                fill="currentColor"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.1,76.6C26.4,84.2,10,86.8,-6.4,87.6C-22.8,88.4,-39.2,87.4,-54.3,82.1C-69.4,76.8,-83.2,67.2,-91.5,54.6C-99.8,42,-102.6,26.4,-100.8,11.7C-99,-3,-92.6,-16.8,-84.4,-29.1C-76.2,-41.4,-66.2,-52.2,-53.9,-60.4C-41.6,-68.6,-26.9,-74.2,-11.8,-77.2C3.3,-80.2,30.6,-83.6,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute -right-16 top-20 h-64 w-64 opacity-20"
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="h-full w-full text-violet-200">
              <path
                fill="currentColor"
                d="M39.6,-65.2C51.2,-57.4,61.2,-47.1,68.1,-34.9C75,-22.7,78.8,-8.6,78.3,5.7C77.8,20,73,34.5,64.2,46.4C55.4,58.3,42.6,67.6,28.6,73.1C14.6,78.6,-0.6,80.3,-15.2,77.8C-29.8,75.3,-43.8,68.6,-55.2,58.9C-66.6,49.2,-75.4,36.5,-79.6,22.6C-83.8,8.7,-83.4,-6.4,-78.5,-19.8C-73.6,-33.2,-64.2,-44.9,-52.1,-52.8C-40,-60.7,-25.2,-64.8,-10.7,-67.5C3.8,-70.2,28,-73,39.6,-65.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="mb-4 inline-flex items-center justify-center">
                <FlowerIcon className="flower-spin h-10 w-10 fill-emerald-500" />
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                Browse by Category
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Explore articles by topic
              </p>
            </div>
            {categories.length > 0 ? (
              <CategoryMarquee
                categories={categories.map((c) => ({
                  name: c.name,
                  slug: c.slug,
                  count: c.count,
                }))}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No categories available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
