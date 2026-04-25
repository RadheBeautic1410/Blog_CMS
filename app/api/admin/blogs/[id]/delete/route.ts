import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { decrementCategoryCount } from "@/lib/category-count";
import { revalidateAfterBlogDelete } from "@/lib/revalidate-blog-public";

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

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: {
        status: true,
        category: true,
        slug: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id },
    });

    if (blog.status === "published") {
      await decrementCategoryCount(blog.category);
      await revalidateAfterBlogDelete({
        slug: blog.slug,
        categoryName: blog.category,
      });
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
