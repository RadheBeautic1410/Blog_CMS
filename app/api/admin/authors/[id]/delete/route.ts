import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    // Check if author has blogs
    const blogsCount = await prisma.blog.count({
      where: {
        authorId: id,
      },
    });

    if (blogsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete author. They have ${blogsCount} blog(s) associated with them.`,
        },
        { status: 400 }
      );
    }

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Author deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting author:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
