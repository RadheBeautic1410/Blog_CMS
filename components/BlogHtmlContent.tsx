"use client";

import { useMemo } from "react";
import { normalizeBlogHtmlForRender } from "@/lib/normalizeBlogHtml";

interface BlogHtmlContentProps {
  html: string;
  className?: string;
}

export default function BlogHtmlContent({ html, className = "blog-content" }: BlogHtmlContentProps) {
  // Normalize at render-time too (not only at save-time) so older posts or pasted HTML
  // still render with correct block structure and spacing.
  const cleanedHtml = useMemo(() => normalizeBlogHtmlForRender(html), [html]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanedHtml }} />;
}
