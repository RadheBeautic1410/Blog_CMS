import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Explore articles organized by topic
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>
              <span className="font-semibold text-[#111827]">{categories.length}</span> categories
            </span>
            <span>•</span>
            <span>
              <span className="font-semibold text-[#111827]">{totalArticles}</span> total articles
            </span>
            <span>•</span>
            <span>
              <span className="font-semibold text-[#111827]">{categoriesWithArticles.length}</span> active categories
            </span>
          </div>
        </div>

        {/* Categories with Articles */}
        {categoriesWithArticles.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              All Categories
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoriesWithArticles.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  count={category.count}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No categories with articles yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Categories will appear here once articles are published.
            </p>
          </div>
        )}

        {/* Empty Categories (if any) */}
        {emptyCategories.length > 0 && (
          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Empty Categories
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {emptyCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">No articles</p>
                    </div>
                    <div className="rounded-full bg-gray-100 p-2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Categories Section */}
        {categoriesWithArticles.length > 4 && (
          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              Most Popular Categories
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoriesWithArticles.slice(0, 6).map((category) => (
                <div
                  key={category.id}
                  className="relative overflow-hidden rounded-lg border-2 border-[#2563EB] bg-gradient-to-br from-[#2563EB]/5 to-[#1D4ED8]/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827]">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {category.count === 1
                          ? "1 article"
                          : `${category.count} articles`}
                      </p>
                      <a
                        href={`/categories/${category.slug}`}
                        className="mt-4 inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                      >
                        View all articles
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="rounded-full bg-[#2563EB] p-4">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
