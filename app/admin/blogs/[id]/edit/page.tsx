import BlogForm from "@/components/admin/BlogForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getBlog(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        category: true,
        author: true,
        authorId: true, // Explicitly select authorId
        image: true,
        tags: true,
        status: true,
        metaTitle: true,
        metaDescription: true,
        featured: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getAuthors() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
    });
    return authors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blog, categories, authors] = await Promise.all([
    getBlog(id),
    getCategories(),
    getAuthors(),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Edit Blog</h1>
        <p className="mt-2 text-gray-600">Update your blog post</p>
      </div>
      <BlogForm blog={blog} categories={categories} authors={authors} />
    </div>
  );
}
