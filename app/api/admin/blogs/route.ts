import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { incrementCategoryCount } from "@/lib/category-count";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      authorId,
      image,
      tags,
      status,
      metaTitle,
      metaDescription,
    } = body;

    // Validate required fields (excerpt is optional)
    if (!title || !slug || !content || !category || !image || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify author exists
    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    const nextStatus = status || "draft";
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? "",
        content,
        category,
        image,
        tags: (tags || []).map((t: string) => String(t).trim().toLowerCase()).filter(Boolean),
        status: nextStatus,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        author: author.name,
        authorId: authorId,
        date: new Date(),
      },
    });

    if (nextStatus === "published") {
      await incrementCategoryCount(category);
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
