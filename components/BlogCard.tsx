import Image from "next/image";
import Link from "next/link";
import { FlowerIcon } from "@/components/icons";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: Date | string;
  category: string;
  image: string;
  slug: string;
  tags?: string[];
  featured?: boolean;
}

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

// Category accent colors for featured cards (soft, muted palette)
const CATEGORY_PALETTE = [
  { text: "text-emerald-600", star: "text-emerald-500", play: "text-emerald-500" },
  { text: "text-amber-600", star: "text-amber-500", play: "text-amber-500" },
  { text: "text-violet-600", star: "text-violet-500", play: "text-violet-500" },
  { text: "text-sky-600", star: "text-sky-500", play: "text-sky-500" },
  { text: "text-rose-600", star: "text-rose-500", play: "text-rose-500" },
  { text: "text-teal-600", star: "text-teal-500", play: "text-teal-500" },
] as const;

function getCategoryColors(category: string) {
  const hash = category.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const categorySlug = blog.category.toLowerCase().replace(/\s+/g, "-");
  const topics =
    blog.tags?.slice(0, 3).map((t) => t.trim()) ||
    (blog.excerpt ? [blog.excerpt.split(".")[0]?.trim() || blog.excerpt.slice(0, 60)] : ["Read more"]);

  if (featured) {
    const colors = getCategoryColors(blog.category);

    return (
      <article className="group p-4 relative flex flex-col overflow-hidden rounded-3xl border-1 border-dashed border-black bg-[#fff7ed] transition-all duration-300 hover:shadow-lg">
        {/* Image with rounded corners and play button overlay */}
        <Link href={`/blogs/${blog.slug}`} className="block overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden rounded-t-[1.25rem] bg-stone-100">
            {blog.image ? (
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100">
                <svg
                  className="h-16 w-16 text-stone-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Category - UPPERCASE, muted color */}
          <Link
            href={`/categories/${categorySlug}`}
            className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${colors.text}`}
          >
            {blog.category}
          </Link>

          {/* Title - bold serif/display */}
          <Link href={`/blogs/${blog.slug}`}>
            <h3 className="font-display mb-4 text-xl font-bold leading-snug text-stone-900 line-clamp-2 transition-colors group-hover:text-stone-700 sm:text-2xl">
              {blog.title}
            </h3>
          </Link>

          {/* Topic tags - single row */}
          <ul className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
            {topics.map((topic, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <FlowerIcon className={`h-3.5 w-3.5 shrink-0 fill-current ${colors.star}`} />
                <span className="capitalize">{topic}</span>
                {i < topics.length - 1 && <span className="text-stone-300">·</span>}
              </li>
            ))}
          </ul>
        </div>
      </article>
    );
  }

  // Default (non-featured) card - Latest Articles
  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200">
      <Link href={`/blogs/${blog.slug}`} className="block overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-[0.875rem] bg-slate-100">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500">
              <svg
                className="h-14 w-14 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/categories/${categorySlug}`}
          className="mb-3 inline-flex w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 transition-colors hover:bg-indigo-200"
        >
          {blog.category}
        </Link>

        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="font-display mb-3 text-lg font-bold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-indigo-600 sm:text-xl">
            {blog.title}
          </h3>
        </Link>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            <span>{blog.author}</span>
            <span className="text-slate-300">·</span>
            <span>{formatDate(blog.date)}</span>
          </div>
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:gap-2"
          >
            Read
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
