import { prisma } from "@/lib/prisma";
import { getOrbitSettings, resolveModel } from "@/lib/orbit/settings";
import { ORBIT_PROVIDERS, isProviderConfigured } from "@/lib/orbit/ai";
import OrbitPanel from "@/components/admin/orbit/OrbitPanel";

export const dynamic = "force-dynamic";

/** Kept in sync with the schedule in vercel.json. */
const CRON_SCHEDULE_LABEL = "08:00 and 18:00 IST (02:30 and 12:30 UTC)";

export default async function OrbitPage() {
  const settings = await getOrbitSettings();

  const [topics, runs, authors, categories, mediaCount] = await Promise.all([
    prisma.orbitTopic.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      take: 100,
    }),
    prisma.orbitRun.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.author.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.media.count(),
  ]);

  return (
    <OrbitPanel
      settings={{
        enabled: settings.enabled,
        provider: settings.provider,
        model: resolveModel(settings),
        autoPublish: settings.autoPublish,
        authorId: settings.authorId,
        categories: settings.categories,
        defaultImage: settings.defaultImage,
        wordCount: settings.wordCount,
        tone: settings.tone,
        language: settings.language,
        extraInstructions: settings.extraInstructions,
        lastRunAt: settings.lastRunAt?.toISOString() ?? null,
        lastRunStatus: settings.lastRunStatus,
      }}
      providers={ORBIT_PROVIDERS.map((p) => ({
        ...p,
        configured: isProviderConfigured(p.id),
      }))}
      topics={topics.map((t) => ({
        id: t.id,
        title: t.title,
        keywords: t.keywords,
        category: t.category,
        notes: t.notes,
        status: t.status,
        source: t.source,
        createdAt: t.createdAt.toISOString(),
      }))}
      runs={runs.map((r) => ({
        id: r.id,
        status: r.status,
        trigger: r.trigger,
        topic: r.topic,
        blogId: r.blogId,
        blogTitle: r.blogTitle,
        blogSlug: r.blogSlug,
        blogStatus: r.blogStatus,
        message: r.message,
        error: r.error,
        durationMs: r.durationMs,
        createdAt: r.createdAt.toISOString(),
      }))}
      authors={authors}
      categories={categories}
      mediaCount={mediaCount}
      cronConfigured={Boolean(process.env.CRON_SECRET)}
      cronSchedule={CRON_SCHEDULE_LABEL}
    />
  );
}
