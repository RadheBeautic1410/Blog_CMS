import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FlowerIcon } from "@/components/icons";
import Link from "next/link";

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

    // Sort by count (most popular first), then by name
    const sortedCategories = categoriesWithCounts.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Sort by count descending
      }
      return a.name.localeCompare(b.name); // Then alphabetically
    });

    return sortedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const totalArticles = categories.reduce((sum, cat) => sum + cat.count, 0);
  const categoriesWithArticles = categories.filter((cat) => cat.count > 0);
  const emptyCategories = categories.filter((cat) => cat.count === 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/20">
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Decorative flowers */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FlowerIcon className="absolute -right-16 top-32 h-32 w-32 fill-indigo-200/25" aria-hidden />
          <FlowerIcon className="absolute -left-12 top-1/2 h-24 w-24 fill-violet-200/20" aria-hidden />
          <FlowerIcon className="absolute right-1/3 bottom-20 h-20 w-20 fill-emerald-200/20" aria-hidden />
        </div>

        {/* Hero header */}
        <section className="relative px-4 pt-16 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center justify-center">
              <FlowerIcon className="flower-spin h-12 w-12 fill-indigo-500" aria-hidden />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
              Browse Categories
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
              Explore articles organized by topic. Find what interests you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                <span className="font-semibold text-indigo-600">{categories.length}</span> categories
              </span>
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                <span className="font-semibold text-indigo-600">{totalArticles}</span> articles
              </span>
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                <span className="font-semibold text-indigo-600">{categoriesWithArticles.length}</span> active
              </span>
            </div>
          </div>
        </section>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          {/* Categories with Articles */}
          {categoriesWithArticles.length > 0 ? (
            <section className="mb-16">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                All Categories
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoriesWithArticles.map((category, i) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    slug={category.slug}
                    count={category.count}
                    index={i}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 py-16 text-center">
              <FlowerIcon className="mx-auto h-14 w-14 fill-slate-300" aria-hidden />
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-800">
                No categories with articles yet
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                Categories will appear here once articles are published.
              </p>
            </div>
          )}

          {/* Most Popular - highlight top categories */}
          {categoriesWithArticles.length > 4 && (
            <section className="mb-16 pt-12 border-t border-slate-200/80">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                Most Popular
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoriesWithArticles.slice(0, 6).map((category, i) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200/70 bg-gradient-to-br from-indigo-50/90 to-violet-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600/90">
                          #{i + 1} popular
                        </span>
                        <h3 className="mt-2 font-display text-xl font-bold text-slate-900">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {category.count === 1 ? "1 article" : `${category.count} articles`}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                          View all
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                      <div className="rounded-xl bg-white/80 p-3 text-indigo-500">
                        <FlowerIcon className="h-8 w-8" aria-hidden />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty Categories (if any) */}
          {emptyCategories.length > 0 && (
            <section className="pt-12 border-t border-slate-200/80">
              <h2 className="font-display text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="h-1 w-6 rounded-full bg-slate-300" />
                Empty Categories
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {emptyCategories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 opacity-75"
                  >
                    <h3 className="text-sm font-medium text-slate-600">{category.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">No articles yet</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
