import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
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
    const allowedStatuses = ["pending", "used", "failed"];

    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const topic = await prisma.orbitTopic.update({
      where: { id },
      data: {
        title: body.title?.trim() || undefined,
        category: body.category !== undefined ? body.category?.trim() || null : undefined,
        notes: body.notes !== undefined ? body.notes?.trim() || null : undefined,
        status: body.status || undefined,
        keywords: Array.isArray(body.keywords)
          ? body.keywords.map((k: string) => String(k).trim()).filter(Boolean)
          : undefined,
      },
    });

    return NextResponse.json({ topic });
  } catch (error: any) {
    console.error("Error updating Orbit topic:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.orbitTopic.delete({ where: { id } });

    return NextResponse.json({ message: "Topic deleted" });
  } catch (error: any) {
    console.error("Error deleting Orbit topic:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
