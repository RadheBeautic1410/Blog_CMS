import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: Date | string;
  category: string;
  image: string;
  slug: string;
  featured?: boolean;
}

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${
        featured ? "hover:scale-[1.02]" : ""
      }`}
    >
      {/* Image */}
      <Link href={`/blogs/${blog.slug}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gray-200 cursor-pointer">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]">
              <svg
                className="h-16 w-16 text-white opacity-50"
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

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <Link
            href={`/categories/${blog.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors"
          >
            {blog.category}
          </Link>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="mb-2 text-xl font-semibold text-[#111827] line-clamp-2 group-hover:text-[#2563EB] transition-colors cursor-pointer">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-sm leading-6 text-gray-600 line-clamp-2">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {blog.author}
            </span>
            <span className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
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
              {new Date(blog.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4">
          <Link
            href={`/blogs/${blog.slug}`}
            className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors inline-flex items-center"
          >
            Read More
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
          </Link>
        </div>
      </div>
    </article>
  );
}
