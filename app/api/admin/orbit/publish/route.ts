import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { incrementCategoryCount } from "@/lib/category-count";
import { revalidateAfterBlogSave } from "@/lib/revalidate-blog-public";

export const dynamic = "force-dynamic";

/**
 * Publish a draft Orbit wrote, from the Orbit panel. Orbit saves posts as
 * drafts by default, so this is the one click that takes a reviewed draft live.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const blogId = typeof body.blogId === "string" ? body.blogId : "";
    if (!blogId) {
      return NextResponse.json({ error: "blogId is required" }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true, slug: true, title: true, status: true, category: true },
    });

    if (!blog) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (blog.status === "published") {
      // Someone published it elsewhere; keep the run log honest and stop here
      // so the category count is not counted twice.
      await syncRunStatus(blog.id);
      return NextResponse.json({
        message: `"${blog.title}" is already live.`,
        blog: { id: blog.id, slug: blog.slug, status: "published" },
      });
    }

    const published = await prisma.blog.update({
      where: { id: blog.id },
      data: { status: "published" },
    });

    await incrementCategoryCount(published.category);
    await revalidateAfterBlogSave({
      slug: published.slug,
      categoryName: published.category,
    });
    await syncRunStatus(published.id);

    return NextResponse.json({
      message: `Published "${published.title}".`,
      blog: { id: published.id, slug: published.slug, status: published.status },
    });
  } catch (error: any) {
    console.error("Error publishing Orbit draft:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/** Flip the run-log rows for this post so the panel stops calling it a draft. */
async function syncRunStatus(blogId: string) {
  await prisma.orbitRun.updateMany({
    where: { blogId },
    data: { blogStatus: "published" },
  });
}
