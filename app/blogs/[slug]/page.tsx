import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

async function getBlog(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog || blog.status !== "published") {
      return null;
    }

    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getAuthor(authorId: string | null) {
  if (!authorId) return null;

  try {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });
    return author;
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

async function getRelatedBlogs(category: string, currentSlug: string, limit: number = 3) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        category,
        slug: { not: currentSlug },
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.image ? [blog.image] : [],
      type: "article",
      publishedTime: blog.date.toString(),
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const [author, relatedBlogs] = await Promise.all([
    getAuthor(blog.authorId),
    getRelatedBlogs(blog.category, blog.slug),
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main>
        {/* Hero Image */}
        {blog.image && (
          <div className="relative h-96 w-full overflow-hidden bg-gray-200">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <Link
                href={`/categories/${blog.category.toLowerCase()}`}
                className="inline-flex items-center rounded-full bg-[#2563EB]/10 px-4 py-2 text-sm font-medium text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors"
              >
                {blog.category}
              </Link>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="mb-6 text-xl text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              {/* Author */}
              <div className="flex items-center space-x-3">
                {author?.avatar ? (
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                    <span className="text-[#2563EB] font-semibold text-sm">
                      {blog.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-[#111827]">{blog.author}</p>
                  {author?.bio && (
                    <p className="text-xs text-gray-500">{author.bio}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={blog.date.toString()}>
                  {format(new Date(blog.date), "MMMM dd, yyyy")}
                </time>
              </div>

              {/* Reading Time Estimate */}
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {Math.ceil(blog.content.split(" ").length / 200)} min read
                </span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Author Card */}
          {author && (
            <div className="mt-12 rounded-lg border border-[#E5E7EB] bg-white p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {author.avatar ? (
                  <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2563EB] font-semibold text-2xl">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">
                    {author.name}
                  </h3>
                  {author.bio && (
                    <p className="text-gray-600 mb-4">{author.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                      >
                        {author.email}
                      </a>
                    )}
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                      >
                        Website
                      </a>
                    )}
                    {author.socialLinks && typeof author.socialLinks === 'object' && (
                      <div className="flex items-center space-x-3">
                        {(author.socialLinks as any).twitter && (
                          <a
                            href={(author.socialLinks as any).twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#2563EB] transition-colors"
                            aria-label="Twitter"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                        )}
                        {(author.socialLinks as any).linkedin && (
                          <a
                            href={(author.socialLinks as any).linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#2563EB] transition-colors"
                            aria-label="LinkedIn"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                        {(author.socialLinks as any).github && (
                          <a
                            href={(author.socialLinks as any).github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#2563EB] transition-colors"
                            aria-label="GitHub"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <section className="mt-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
                  Related Articles
                </h2>
                <p className="mt-2 text-gray-600">
                  More articles from {blog.category}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E5E7EB] pt-8">
            <Link
              href="/blogs"
              className="inline-flex items-center text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
            <Link
              href="/"
              className="inline-flex items-center text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              Go to Home
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
