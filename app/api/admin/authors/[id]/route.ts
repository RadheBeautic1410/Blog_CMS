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
    const { name, email, bio, avatar, website, socialLinks } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if email already exists for another author (if provided)
    if (email) {
      const existingAuthor = await prisma.author.findUnique({
        where: { email },
      });

      if (existingAuthor && existingAuthor.id !== id) {
        return NextResponse.json(
          { error: "An author with this email already exists" },
          { status: 400 }
        );
      }
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        email: email || null,
        bio: bio || null,
        avatar: avatar || null,
        website: website || null,
        socialLinks: socialLinks || null,
      },
    });

    return NextResponse.json({ author }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating author:", error);
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
