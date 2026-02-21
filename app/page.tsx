import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import CategoryCard from "@/components/CategoryCard";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
      })
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
    <div className="min-h-screen bg-[#FFF7ED]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Featured Blog Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">
                Featured Posts
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">
                Handpicked articles you don't want to miss
              </p>
            </div>
            {featuredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} featured />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#6B7280]">
                <p>No featured posts available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">
                  Latest Articles
                </h2>
                <p className="mt-4 text-lg text-[#6B7280]">
                  Stay updated with our newest content
                </p>
              </div>
            </div>
            {latestBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {latestBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#6B7280]">
                <p>No articles available yet.</p>
              </div>
            )}
            <div className="mt-12 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center rounded-lg bg-[#F97316] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#EA580C] transition-colors"
              >
                View All Blogs
                <svg
                  className="ml-2 h-5 w-5"
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

        {/* Categories Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">
                Browse by Category
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">
                Explore articles by topic
              </p>
            </div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.slug}
                    name={category.name}
                    slug={category.slug}
                    count={category.count}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#6B7280]">
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
