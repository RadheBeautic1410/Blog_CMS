"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  email?: string | null;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  tags: string[];
  status: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  authorId?: string | null;
}

interface BlogFormProps {
  blog?: Blog;
  categories: Category[];
  authors: Author[];
}

export default function BlogForm({ blog, categories, authors }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Determine initial authorId: use blog's authorId if it exists, otherwise use first author
  const getInitialAuthorId = () => {
    // Always prefer the blog's existing authorId if it exists
    if (blog?.authorId) {
      return blog.authorId;
    }
    // Default to first author if no authorId in blog
    return authors[0]?.id || "";
  };

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    category: blog?.category || categories[0]?.name || "",
    authorId: getInitialAuthorId(),
    image: blog?.image || "",
    tags: blog?.tags?.join(", ") || "",
    status: blog?.status || "draft",
    metaTitle: blog?.metaTitle || "",
    metaDescription: blog?.metaDescription || "",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !slugManuallyEdited) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (slug && slug !== formData.slug) {
        setFormData((prev) => ({ ...prev, slug }));
      }
    }
  }, [formData.title, slugManuallyEdited]);

  // Update authorId when blog data is loaded
  useEffect(() => {
    if (blog?.authorId && blog.authorId !== formData.authorId) {
      setFormData((prev) => ({ ...prev, authorId: blog.authorId! }));
    }
  }, [blog?.authorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Dispatch event for header buttons
    window.dispatchEvent(new CustomEvent("blog-form-loading"));

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = blog ? `/api/admin/blogs/${blog.id}` : "/api/admin/blogs";
      const method = blog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
      // Dispatch event for header buttons
      window.dispatchEvent(new CustomEvent("blog-form-complete"));
    }
  };

  return (
    <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="Enter blog title"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            required
            value={formData.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setFormData({ ...formData, slug: e.target.value });
            }}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="blog-post-slug"
          />
          <p className="mt-1 text-xs text-gray-500">
            Auto-generated from title. You can edit it manually.
          </p>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Short Description *
          </label>
          <textarea
            id="excerpt"
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="Brief description of the blog post"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Featured Image *
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            folder="blogs"
          />
          {!formData.image && (
            <p className="mt-1 text-xs text-red-500">
              Please upload an image or enter an image URL
            </p>
          )}
        </div>

        {/* Category, Author, and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="authorId"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Author *
            </label>
            <select
              id="authorId"
              required
              value={formData.authorId}
              onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            >
              {authors.length === 0 ? (
                <option value="">No authors available</option>
              ) : (
                <>
                  {/* Show current author even if not in list (might have been deleted) */}
                  {blog?.authorId && !authors.some(a => a.id === blog.authorId) && (
                    <option value={blog.authorId} disabled>
                      Author (Not Found)
                    </option>
                  )}
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Status *
            </label>
            <select
              id="status"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="tag1, tag2, tag3"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate tags with commas
          </p>
        </div>

        {/* Meta Title */}
        <div>
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Meta Title
          </label>
          <input
            type="text"
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="SEO meta title"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-[#111827] mb-2"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            rows={3}
            value={formData.metaDescription}
            onChange={(e) =>
              setFormData({ ...formData, metaDescription: e.target.value })
            }
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            placeholder="SEO meta description"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
