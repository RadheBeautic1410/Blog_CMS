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
    const { name, alt, caption, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const media = await prisma.media.update({
      where: { id },
      data: {
        name,
        alt: alt || null,
        caption: caption || null,
        description: description || null,
      },
    });

    return NextResponse.json({ media }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating media:", error);
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
