import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category || !image || !authorId) {
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

    // Check if slug already exists for another blog
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog && existingBlog.id !== id) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        image,
        tags: tags || [],
        status: status || "draft",
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        author: author.name,
        authorId: authorId,
      },
    });

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
