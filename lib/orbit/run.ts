import { prisma } from "@/lib/prisma";
import { generateJson, getProviderMeta } from "@/lib/orbit/ai";
import { getOrbitSettings, resolveModel, type OrbitSettings } from "@/lib/orbit/settings";
import {
  sanitizeGeneratedHtml,
  toPlainText,
  uniqueSlug,
  wordCount,
} from "@/lib/orbit/content";
import { incrementCategoryCount } from "@/lib/category-count";
import { revalidateAfterBlogSave } from "@/lib/revalidate-blog-public";
import { NEXT_PUBLIC_URL } from "@/app/constants/env";

export type OrbitTrigger = "cron" | "manual";

export interface OrbitRunResult {
  status: "success" | "failed" | "skipped";
  message: string;
  runId: string;
  blog?: {
    id: string;
    title: string;
    slug: string;
    status: string;
    url: string;
  };
}

/**
 * A cron hit inside this window of a successful run is treated as a duplicate.
 * Must stay well below the gap between two scheduled runs (currently 10 hours,
 * 08:00 and 18:00 IST) or the second run of the day would skip itself.
 */
const DUPLICATE_WINDOW_HOURS = 6;

interface ArticleDraft {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  imageKeywords?: string[];
}

interface TopicDraft {
  title?: string;
  keywords?: string[];
  category?: string;
  angle?: string;
}

/**
 * Write and (optionally) publish one post. Safe to call repeatedly: every call
 * records an OrbitRun row, and cron calls are de-duplicated per day.
 */
export async function runOrbit(options: {
  trigger: OrbitTrigger;
  force?: boolean;
}): Promise<OrbitRunResult> {
  const startedAt = Date.now();
  const { trigger, force = false } = options;
  const settings = await getOrbitSettings();
  const model = resolveModel(settings);

  try {
    if (trigger === "cron" && !settings.enabled) {
      return await finish({
        settings,
        trigger,
        model,
        startedAt,
        status: "skipped",
        message: "Orbit is turned off.",
      });
    }

    if (trigger === "cron" && !force) {
      const since = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000);
      const recent = await prisma.orbitRun.findFirst({
        where: { status: "success", createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
      });
      if (recent) {
        return await finish({
          settings,
          trigger,
          model,
          startedAt,
          status: "skipped",
          message: `Already published "${recent.blogTitle}" within the last ${DUPLICATE_WINDOW_HOURS} hours.`,
        });
      }
    }

    const author = await resolveAuthor(settings);
    if (!author) {
      throw new Error(
        "No author available. Create an author under Admin - Authors, then pick it in Orbit settings."
      );
    }

    const categoryNames = await resolveCategoryPool(settings);
    if (categoryNames.length === 0) {
      throw new Error(
        "No categories available. Create at least one category under Admin - Categories."
      );
    }

    const recentTitles = await getRecentTitles();
    const topic = await pickTopic({ settings, model, categoryNames, recentTitles });

    const category = pickCategory(topic.category, categoryNames);
    const article = await writeArticle({
      settings,
      model,
      topic,
      category,
      recentTitles,
    });

    const image = await pickImage(settings, [
      ...(article.imageKeywords ?? []),
      ...topic.keywords,
      category,
    ]);
    if (!image) {
      throw new Error(
        "No featured image available. Upload an image to the Media Library or set a default image in Orbit settings."
      );
    }

    const title = (article.title || topic.title).trim();
    const content = sanitizeGeneratedHtml(article.content || "");
    if (wordCount(content) < 120) {
      throw new Error("The model returned an article that was too short to publish.");
    }

    const slug = await uniqueSlug(article.slug || title);
    const blogStatus = settings.autoPublish ? "published" : "draft";

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: (article.excerpt || toPlainText(content).slice(0, 180)).trim(),
        content,
        category,
        image,
        tags: normalizeTags(article.tags, topic.keywords),
        status: blogStatus,
        metaTitle: article.metaTitle?.trim() || title,
        metaDescription:
          article.metaDescription?.trim() ||
          toPlainText(content).slice(0, 155),
        author: author.name,
        authorId: author.id,
        date: new Date(),
      },
    });

    if (blogStatus === "published") {
      await incrementCategoryCount(category);
      await revalidateAfterBlogSave({ slug: blog.slug, categoryName: category });
    }

    if (topic.id) {
      await prisma.orbitTopic.update({
        where: { id: topic.id },
        data: { status: "used", usedAt: new Date(), blogId: blog.id },
      });
    }

    return await finish({
      settings,
      trigger,
      model,
      startedAt,
      status: "success",
      message:
        blogStatus === "published"
          ? `Published "${blog.title}".`
          : `Saved "${blog.title}" as a draft for review.`,
      topic,
      blog: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        status: blogStatus,
        url: `${NEXT_PUBLIC_URL}/blogs/${blog.slug}`,
      },
    });
  } catch (error: any) {
    return await finish({
      settings,
      trigger,
      model,
      startedAt,
      status: "failed",
      message: error?.message || "Orbit run failed.",
      error: error?.message || String(error),
    });
  }
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

async function resolveAuthor(settings: OrbitSettings) {
  if (settings.authorId) {
    const chosen = await prisma.author.findUnique({
      where: { id: settings.authorId },
    });
    if (chosen) return chosen;
  }
  return prisma.author.findFirst({ orderBy: { createdAt: "asc" } });
}

async function resolveCategoryPool(settings: OrbitSettings): Promise<string[]> {
  const all = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const allNames = all.map((c) => c.name);

  const allowed = settings.categories.filter((name) => allNames.includes(name));
  return allowed.length > 0 ? allowed : allNames;
}

function pickCategory(preferred: string | null, pool: string[]): string {
  if (preferred) {
    const match = pool.find(
      (name) => name.toLowerCase() === preferred.toLowerCase()
    );
    if (match) return match;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

async function getRecentTitles(): Promise<string[]> {
  const rows = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    select: { title: true },
  });
  return rows.map((r) => r.title);
}

interface ResolvedTopic {
  id: string | null;
  title: string;
  keywords: string[];
  category: string | null;
  notes: string | null;
  source: "manual" | "ai";
}

/** Next pending topic from the queue, or a fresh one from the model. */
async function pickTopic(input: {
  settings: OrbitSettings;
  model: string;
  categoryNames: string[];
  recentTitles: string[];
}): Promise<ResolvedTopic> {
  const queued = await prisma.orbitTopic.findFirst({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  if (queued) {
    return {
      id: queued.id,
      title: queued.title,
      keywords: queued.keywords,
      category: queued.category,
      notes: queued.notes,
      source: "manual",
    };
  }

  const draft = await generateJson<TopicDraft>({
    provider: input.settings.provider,
    model: input.model,
    // Generous for a few lines of JSON: reasoning models spend part of this
    // budget on thinking before they emit anything.
    maxTokens: 3000,
    systemPrompt:
      "You are a content strategist. You reply with a single JSON object and nothing else.",
    userPrompt: [
      `Suggest one fresh blog post topic for the site ${NEXT_PUBLIC_URL}.`,
      ``,
      `Available categories: ${input.categoryNames.join(", ")}`,
      ``,
      `Already published (do not repeat or closely paraphrase these):`,
      input.recentTitles.map((t) => `- ${t}`).join("\n") || "- (nothing yet)",
      ``,
      `Pick a topic readers are actively searching for, specific enough to answer well in one article.`,
      ``,
      `Reply with JSON exactly in this shape:`,
      `{"title": "the post title", "keywords": ["3-6 search keywords"], "category": "one of the available categories", "angle": "one sentence on what makes this article useful"}`,
    ].join("\n"),
  });

  const title = (draft.title || "").trim();
  if (!title) {
    throw new Error("The model did not return a usable topic.");
  }

  const created = await prisma.orbitTopic.create({
    data: {
      title,
      keywords: (draft.keywords ?? []).map((k) => String(k).trim()).filter(Boolean),
      category: draft.category?.trim() || null,
      notes: draft.angle?.trim() || null,
      status: "pending",
      source: "ai",
    },
  });

  return {
    id: created.id,
    title: created.title,
    keywords: created.keywords,
    category: created.category,
    notes: created.notes,
    source: "ai",
  };
}

async function writeArticle(input: {
  settings: OrbitSettings;
  model: string;
  topic: ResolvedTopic;
  category: string;
  recentTitles: string[];
}): Promise<ArticleDraft> {
  const { settings, topic, category } = input;

  const systemPrompt = [
    `You are a senior content writer and SEO editor for the blog at ${NEXT_PUBLIC_URL}.`,
    `You write original, accurate, genuinely useful articles in ${settings.language}.`,
    `House tone: ${settings.tone}.`,
    `You never invent statistics, quotes, prices, dates or research findings. If a specific number would be needed, write around it instead of guessing.`,
    `You reply with a single JSON object and nothing else.`,
  ].join(" ");

  const userPrompt = [
    `Write a complete blog post.`,
    ``,
    `Topic: ${topic.title}`,
    topic.notes ? `Angle: ${topic.notes}` : "",
    topic.keywords.length ? `Target keywords: ${topic.keywords.join(", ")}` : "",
    `Category: ${category}`,
    `Target length: about ${settings.wordCount} words.`,
    settings.extraInstructions ? `\nHouse rules:\n${settings.extraInstructions}` : "",
    ``,
    `Already published on this site - do not repeat these:`,
    input.recentTitles.map((t) => `- ${t}`).join("\n") || "- (nothing yet)",
    ``,
    `HTML rules for the "content" field:`,
    `- Plain semantic HTML only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <table>, <a href="...">.`,
    `- Start with a short opening paragraph, not a heading. Do not include an <h1> - the title is rendered separately.`,
    `- No markdown, no inline style attributes, no class attributes, no <img> tags, no wrapper <div>.`,
    `- Break the article into 4-7 <h2> sections and close with a short conclusion.`,
    ``,
    `Reply with JSON exactly in this shape:`,
    `{`,
    `  "title": "final post title, max 70 characters",`,
    `  "slug": "url-safe-slug",`,
    `  "excerpt": "1-2 sentence summary, max 200 characters",`,
    `  "metaTitle": "SEO title, max 60 characters",`,
    `  "metaDescription": "SEO description, max 155 characters",`,
    `  "tags": ["5-8 lowercase tags"],`,
    `  "imageKeywords": ["2-4 single words describing a fitting featured image"],`,
    `  "content": "the full article as HTML"`,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");

  return generateJson<ArticleDraft>({
    provider: settings.provider,
    model: input.model,
    // ~1.4 tokens per word, plus HTML markup, plus room for thinking tokens.
    maxTokens: Math.max(6000, Math.round(settings.wordCount * 5)),
    systemPrompt,
    userPrompt,
  });
}

/**
 * Featured image, in order of preference: a Media Library item whose name or alt
 * text matches one of the keywords, any other library image, then the configured
 * default. Matching happens in memory - MongoDB `contains` is case-sensitive.
 */
async function pickImage(
  settings: OrbitSettings,
  keywords: string[]
): Promise<string | null> {
  const library = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { url: true, name: true, alt: true, caption: true, mimeType: true },
  });

  const images = library.filter(
    (m) => !m.mimeType || m.mimeType.startsWith("image/")
  );

  const terms = keywords
    .flatMap((k) => String(k || "").toLowerCase().split(/[^a-z0-9]+/i))
    .filter((k) => k.length > 3);

  for (const term of terms) {
    const hit = images.find((m) =>
      [m.name, m.alt, m.caption]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
    if (hit) return hit.url;
  }

  if (images.length > 0) {
    return images[Math.floor(Math.random() * images.length)].url;
  }

  return settings.defaultImage?.trim() || null;
}

function normalizeTags(tags: string[] | undefined, fallback: string[]): string[] {
  const source = tags?.length ? tags : fallback;
  const cleaned = source
    .map((t) => String(t).trim().toLowerCase())
    .filter(Boolean)
    .map((t) => t.replace(/^#/, ""));
  return Array.from(new Set(cleaned)).slice(0, 8);
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

async function finish(input: {
  settings: OrbitSettings;
  trigger: OrbitTrigger;
  model: string;
  startedAt: number;
  status: "success" | "failed" | "skipped";
  message: string;
  error?: string;
  topic?: ResolvedTopic;
  blog?: OrbitRunResult["blog"];
}): Promise<OrbitRunResult> {
  const { settings, trigger, model, startedAt, status, message, error, topic, blog } =
    input;

  // A failed run leaves the topic pending on purpose: most failures are
  // transient (rate limit, timeout), and the next run should retry it. A topic
  // the model genuinely cannot write is visible in the run log and can be
  // deleted from the queue.

  const run = await prisma.orbitRun.create({
    data: {
      status,
      trigger,
      topic: topic?.title ?? null,
      topicId: topic?.id ?? null,
      blogId: blog?.id ?? null,
      blogSlug: blog?.slug ?? null,
      blogTitle: blog?.title ?? null,
      blogStatus: blog?.status ?? null,
      provider: settings.provider,
      model,
      message,
      error: error ?? null,
      durationMs: Date.now() - startedAt,
    },
  });

  if (status !== "skipped") {
    await prisma.orbitSettings.update({
      where: { id: settings.id },
      data: { lastRunAt: new Date(), lastRunStatus: status },
    });
  }

  if (status === "failed") {
    console.error(`[orbit] ${getProviderMeta(settings.provider).label} run failed:`, error);
  }

  return { status, message, runId: run.id, blog };
}
