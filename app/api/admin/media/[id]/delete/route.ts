import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get media record
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    // Check if media is used in blogs
    const blogsUsingMedia = await prisma.blog.count({
      where: {
        image: media.url,
      },
    });

    // Check if media is used in authors
    const authorsUsingMedia = await prisma.author.count({
      where: {
        avatar: media.url,
      },
    });

    if (blogsUsingMedia > 0 || authorsUsingMedia > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete media. It is being used in ${blogsUsingMedia + authorsUsingMedia} place(s).`,
        },
        { status: 400 }
      );
    }

    // Try to delete from Firebase Storage
    try {
      // Extract the path from the URL
      const url = new URL(media.url);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (firebaseError: any) {
      // Log error but continue with database deletion
      console.error("Error deleting from Firebase Storage:", firebaseError);
      // Continue with database deletion even if Firebase deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Media deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting media:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
