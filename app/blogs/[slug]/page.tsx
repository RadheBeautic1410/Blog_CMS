import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/ui/Button";
import { FlowerIcon } from "@/components/icons";
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

  const categorySlug = blog.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-indigo-50/50 relative">
      {/* Decorative flower background - scattered across the page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <FlowerIcon className="absolute -right-8 top-28 h-44 w-44 fill-indigo-300/65 -rotate-12" aria-hidden />
        <FlowerIcon className="absolute -left-4 top-36 h-36 w-36 fill-violet-300/60 rotate-[15deg]" aria-hidden />
        <FlowerIcon className="absolute right-[12%] top-[42%] h-32 w-32 fill-rose-300/55 rotate-[-8deg]" aria-hidden />
        <FlowerIcon className="absolute left-[8%] top-[55%] h-40 w-40 fill-emerald-300/60 rotate-[20deg]" aria-hidden />
        <FlowerIcon className="absolute -right-10 bottom-[30%] h-36 w-36 fill-amber-300/55 rotate-[-15deg]" aria-hidden />
        <FlowerIcon className="absolute -left-6 bottom-[20%] h-32 w-32 fill-pink-300/60 rotate-[10deg]" aria-hidden />
        <FlowerIcon className="absolute right-[22%] bottom-24 h-28 w-28 fill-indigo-300/50 rotate-[-5deg]" aria-hidden />
      </div>
      <Navbar />
      <main className="relative overflow-hidden">
        <article className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {/* Hero Image - Centered with shadow */}
          {blog.image && (
            <div className="mb-10 sm:mb-12 flex justify-center">
              <div className="relative w-full h-[26rem] sm:h-[30rem] overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-300/40 ring-1 ring-slate-200/60 sm:rounded-3xl">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <Link
                    href={`/categories/${categorySlug}`}
                    className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md ring-1 ring-white/50 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    {blog.category}
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Header */}
          <header className="mb-10">
            {!blog.image && (
              <div className="mb-4">
                <Link
                  href={`/categories/${categorySlug}`}
                  className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 ring-1 ring-indigo-200/60 hover:bg-indigo-100 transition-colors"
                >
                  {blog.category}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-5 text-xl text-slate-600 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Information */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              {/* Author */}
              <div className="flex items-center gap-3">
                {author?.avatar ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold shadow">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{blog.author}</p>
                  {author?.bio && (
                    <p className="text-xs text-slate-500">{author.bio}</p>
                  )}
                </div>
              </div>

              <span className="text-slate-300">•</span>

              {/* Date */}
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={blog.date.toString()}>
                  {format(new Date(blog.date), "MMMM d, yyyy")}
                </time>
              </div>

              <span className="text-slate-300">•</span>

              {/* Reading Time */}
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Math.ceil(blog.content.split(" ").length / 200)} min read</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/60 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/50 sm:p-8 md:p-10">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Author Card */}
          {author && (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                {author.avatar ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow-md">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-md">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FlowerIcon className="h-5 w-5 fill-indigo-500/80" aria-hidden />
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Written by {author.name}
                    </h3>
                  </div>
                  {author.bio && (
                    <p className="text-slate-600 mb-4">{author.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        {author.email}
                      </a>
                    )}
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
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
                            className="text-slate-400 hover:text-indigo-500 transition-colors"
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
                            className="text-slate-400 hover:text-indigo-500 transition-colors"
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
                            className="text-slate-400 hover:text-indigo-500 transition-colors"
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
              <div className="mb-8 flex items-center gap-3">
                <span className="h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    Related Articles
                  </h2>
                  <p className="mt-1 text-slate-600">
                    More from {blog.category}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-8">
            <Button href="/blogs" variant="secondary" size="md">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blogs
            </Button>
            <Button href="/" variant="primary" size="md">
              Go to Home
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Button>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
}
