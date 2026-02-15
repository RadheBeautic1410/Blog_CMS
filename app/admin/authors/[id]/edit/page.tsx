import AuthorForm from "@/components/admin/AuthorForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getAuthor(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid author ID format:", id);
      return null;
    }

    const author = await prisma.author.findUnique({
      where: { id },
    });
    return author;
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await getAuthor(id);

  if (!author) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Edit Author</h1>
        <p className="mt-2 text-gray-600">Update author information</p>
      </div>
      <AuthorForm author={author} />
    </div>
  );
}
