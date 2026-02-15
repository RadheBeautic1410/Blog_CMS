import CategoryForm from "@/components/admin/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Create New Category</h1>
        <p className="mt-2 text-gray-600">Add a new category for your blog posts</p>
      </div>
      <CategoryForm />
    </div>
  );
}
