import BlogForm from "@/components/admin/BlogForm";
import { prisma } from "@/lib/prisma";

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

export default async function CreateBlogPage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Create New Blog</h1>
        <p className="mt-2 text-gray-600">Add a new blog post to your site</p>
      </div>
      <BlogForm categories={categories} authors={authors} />
    </div>
  );
}
