import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getOrbitSettings } from "@/lib/orbit/settings";
import { ORBIT_PROVIDERS, isProviderConfigured } from "@/lib/orbit/ai";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getOrbitSettings();

    return NextResponse.json({
      settings,
      providers: ORBIT_PROVIDERS.map((p) => ({
        ...p,
        configured: isProviderConfigured(p.id),
      })),
    });
  } catch (error: any) {
    console.error("Error loading Orbit settings:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const current = await getOrbitSettings();

    if (
      body.provider !== undefined &&
      !ORBIT_PROVIDERS.some((p) => p.id === body.provider)
    ) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    }

    const wordCount = Number(body.wordCount);

    const settings = await prisma.orbitSettings.update({
      where: { id: current.id },
      data: {
        enabled: body.enabled ?? current.enabled,
        provider: body.provider ?? current.provider,
        model: body.model?.trim() || current.model,
        autoPublish: body.autoPublish ?? current.autoPublish,
        authorId: body.authorId?.trim() || null,
        categories: Array.isArray(body.categories)
          ? body.categories.map((c: string) => String(c).trim()).filter(Boolean)
          : current.categories,
        defaultImage: body.defaultImage?.trim() || null,
        wordCount:
          Number.isFinite(wordCount) && wordCount >= 300 && wordCount <= 4000
            ? Math.round(wordCount)
            : current.wordCount,
        tone: body.tone?.trim() || current.tone,
        language: body.language?.trim() || current.language,
        extraInstructions: body.extraInstructions?.trim() || null,
      },
    });

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Error saving Orbit settings:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
