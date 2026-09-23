import { prisma } from "@/lib/prisma";

/**
 * Server-side cleanup for model-written HTML. `lib/normalizeBlogHtml.ts` is the
 * browser-side equivalent used by the editor; it needs a DOM, so Orbit does its
 * own conservative pass with regexes instead.
 */
export function sanitizeGeneratedHtml(input: string): string {
  let html = (input || "").trim();

  // Drop a code fence if the model wrapped the whole document in one.
  html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "");

  // Executable / styling payloads never belong in post content.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "");
  html = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, "");
  html = html.replace(/<\/?(?:html|head|body|meta|link|title)\b[^>]*>/gi, "");

  // Inline event handlers and javascript: URLs.
  html = html.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');

  // The blog title is already rendered as the page h1; demote any h1 in body.
  html = html.replace(/<(\/?)h1(\s[^>]*)?>/gi, "<$1h2$2>");

  return html.trim();
}

export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
    .replace(/-$/, "");
}

/** Append -2, -3 ... until the slug is free. */
export async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || `post-${Date.now()}`;
  let candidate = root;
  let suffix = 2;

  // Bounded so a pathological collision can never spin forever.
  while (suffix < 50) {
    const clash = await prisma.blog.findUnique({ where: { slug: candidate } });
    if (!clash) return candidate;
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }

  return `${root}-${Date.now()}`;
}

export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html: string): number {
  const text = toPlainText(html);
  return text ? text.split(" ").length : 0;
}
