import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

async function searchBlogs(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim();

    // For MongoDB, we'll use contains which works case-sensitively
    const blogs = await prisma.blog.findMany({
      where: {
        status: "published",
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            excerpt: {
              contains: searchTerm,
            },
          },
          {
            content: {
              contains: searchTerm,
            },
          },
          {
            tags: {
              has: searchTerm,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return blogs;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

async function SearchResults({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const blogs = await searchBlogs(query);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl mb-4">
            Search Results
          </h1>
          {query ? (
            <p className="text-lg text-gray-600">
              {blogs.length === 0
                ? `No results found for "${query}"`
                : `Found ${blogs.length} ${blogs.length === 1 ? "result" : "results"} for "${query}"`}
            </p>
          ) : (
            <p className="text-lg text-gray-600">Please enter a search query</p>
          )}
        </div>

        {query && blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : query && blogs.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search terms or browse our categories.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Enter a search query to find articles.</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9FAFB]">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading search results...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
