import CategoryForm from "@/components/admin/CategoryForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getCategory(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid category ID format:", id);
      return null;
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Edit Category</h1>
        <p className="mt-2 text-gray-600">Update category information</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
