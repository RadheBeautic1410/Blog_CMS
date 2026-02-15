import UserForm from "@/components/admin/UserForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getUser(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid user ID format:", id);
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Edit User</h1>
        <p className="mt-2 text-gray-600">Update user information and permissions</p>
      </div>
      <UserForm user={user} />
    </div>
  );
}
