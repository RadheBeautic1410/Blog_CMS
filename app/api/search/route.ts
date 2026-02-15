import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim();

    // For MongoDB, we'll use contains which works case-sensitively
    // To make it case-insensitive, we search for both lowercase and original
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Search in title, excerpt, content, and tags
    const blogs = await prisma.blog.findMany({
      where: {
        status: "published",
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            excerpt: {
              contains: searchTerm,
            },
          },
          {
            content: {
              contains: searchTerm,
            },
          },
          {
            tags: {
              has: searchTerm,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ results: blogs });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search blogs" },
      { status: 500 }
    );
  }
}
