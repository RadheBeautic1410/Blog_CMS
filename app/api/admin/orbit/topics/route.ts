import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status");

    const topics = await prisma.orbitTopic.findMany({
      where: status ? { status } : {},
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      take: 200,
    });

    return NextResponse.json({ topics });
  } catch (error: any) {
    console.error("Error loading Orbit topics:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Accepts one topic, or a `titles` block with one topic per line so a week of
 * ideas can be pasted in at once.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const titles: string[] = body.titles
      ? String(body.titles)
          .split("\n")
          .map((line: string) => line.trim())
          .filter(Boolean)
      : [String(body.title || "").trim()].filter(Boolean);

    if (titles.length === 0) {
      return NextResponse.json(
        { error: "At least one topic title is required" },
        { status: 400 }
      );
    }

    const keywords = Array.isArray(body.keywords)
      ? body.keywords.map((k: string) => String(k).trim()).filter(Boolean)
      : String(body.keywords || "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);

    const created = await prisma.orbitTopic.createMany({
      data: titles.map((title) => ({
        title,
        // Shared keywords/category only make sense for a single topic.
        keywords: titles.length === 1 ? keywords : [],
        category: titles.length === 1 ? body.category?.trim() || null : null,
        notes: titles.length === 1 ? body.notes?.trim() || null : null,
        status: "pending",
        source: "manual",
      })),
    });

    return NextResponse.json({ count: created.count }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating Orbit topics:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
