import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEXT_PUBLIC_URL } from "@/app/constants/env";

const PER_PAGE = 12;

async function getBlogsByTag(tagSlug: string, page: number = 1) {
  try {
    const skip = (page - 1) * PER_PAGE;
    // Match tag case-insensitively: slug is lowercase, DB may have mixed case
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: {
          status: "published",
          tags: {
            hasSome: [tagSlug],
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          author: true,
          category: true,
          image: true,
          date: true,
          createdAt: true,
          featured: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: PER_PAGE,
      }),
      prisma.blog.count({
        where: {
          status: "published",
          tags: {
            hasSome: [tagSlug],
          },
        },
      }),
    ]);

    return {
      blogs,
      total,
      totalPages: Math.ceil(total / PER_PAGE),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    return {
      blogs: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tagSlug = decodeURIComponent(slug).toLowerCase();
  const tagLabel = tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1);

  return {
    title: `#${tagLabel} - Blog Posts`,
    description: `Browse all blog posts tagged with #${tagLabel}.`,
    alternates: {
      canonical: `${NEXT_PUBLIC_URL}/tags/${slug}`,
    },
    openGraph: {
      title: `#${tagLabel} - Blog Posts`,
      description: `Browse all blog posts tagged with #${tagLabel}.`,
      type: "website",
      url: `${NEXT_PUBLIC_URL}/tags/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `#${tagLabel} - Blog Posts`,
      description: `Browse all blog posts tagged with #${tagLabel}.`,
    },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { page?: string };
}) {
  const { slug } = await params;
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));
  const tagSlug = decodeURIComponent(slug).toLowerCase();

  const { blogs, total, totalPages } = await getBlogsByTag(tagSlug, currentPage);

  // If no blogs and first page, treat as not found (invalid or empty tag)
  if (blogs.length === 0 && currentPage === 1) {
    notFound();
  }

  const tagLabel = tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#2563EB] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="h-4 w-4"
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
            </li>
            <li className="text-[#111827] font-medium">#{tagLabel}</li>
          </ol>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <svg
                className="h-8 w-8 text-indigo-600"
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
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
                #{tagLabel}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {total === 0
                  ? "No posts with this tag yet"
                  : total === 1
                  ? "1 post"
                  : `${total} posts`}
              </p>
            </div>
          </div>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                {currentPage > 1 && (
                  <Link
                    href={`/tags/${tagSlug}?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Link
                            key={page}
                            href={`/tags/${tagSlug}?page=${page}`}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              page === currentPage
                                ? "bg-[#2563EB] text-white"
                                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </Link>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
                {currentPage < totalPages && (
                  <Link
                    href={`/tags/${tagSlug}?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
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
              No posts with this tag yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Check back later or browse other tags.
            </p>
            <div className="mt-6">
              <Link
                href="/blogs"
                className="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
