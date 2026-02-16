import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET endpoint to fetch media
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // MongoDB doesn't support case-insensitive search directly
    // We'll use regex for case-insensitive matching
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { alt: { contains: search } },
            { caption: { contains: search } },
          ],
        }
      : {};

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      media,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint is for creating media records when images are uploaded
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      url,
      alt,
      caption,
      description,
      mimeType,
      size,
      width,
      height,
      folder,
    } = body;

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existingMedia = await prisma.media.findUnique({
      where: { url },
    });

    if (existingMedia) {
      return NextResponse.json(
        { error: "Media with this URL already exists", media: existingMedia },
        { status: 400 }
      );
    }

    const media = await prisma.media.create({
      data: {
        name,
        url,
        alt: alt || null,
        caption: caption || null,
        description: description || null,
        mimeType: mimeType || null,
        size: size || null,
        width: width || null,
        height: height || null,
        folder: folder || null,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
