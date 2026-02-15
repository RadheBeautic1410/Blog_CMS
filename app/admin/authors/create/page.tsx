import AuthorForm from "@/components/admin/AuthorForm";

export default function CreateAuthorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Create New Author</h1>
        <p className="mt-2 text-gray-600">Add a new author to your blog</p>
      </div>
      <AuthorForm />
    </div>
  );
}
