import MediaForm from "@/components/admin/MediaForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getMedia(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid media ID format:", id);
      return null;
    }

    const media = await prisma.media.findUnique({
      where: { id },
    });
    return media;
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
}

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMedia(id);

  if (!media) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Edit Media</h1>
        <p className="mt-2 text-gray-600">Update media information</p>
      </div>
      <MediaForm media={media} />
    </div>
  );
}
