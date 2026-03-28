/**
 * Frontend render normalizer:
 * - Flattens wrapper divs and converts leaf divs to paragraphs
 * - Removes editor spacer paragraphs (<p><br></p>) so spacing is controlled by CSS
 * - Promotes "bold title" paragraphs into semantic headings for consistent styling
 * - Removes editor-only noise (selection classes, redundant inline letter-spacing)
 *
 * IMPORTANT: do NOT use this for editor storage (it will remove blank lines).
 */
export function normalizeBlogHtmlForRender(rawHtml: string): string {
  if (typeof document === "undefined") return rawHtml.trim();
  if (!rawHtml.trim()) return rawHtml;

  const root = document.createElement("div");
  root.innerHTML = rawHtml;

  root.querySelectorAll(".isSelectedEnd").forEach((el) => {
    el.classList.remove("isSelectedEnd");
  });

  unwrapStructuralDivs(root);
  convertLeafDivsToParagraphs(root);
  promoteBolderSpanTitles(root);
  splitBoldTitleBodyParagraphs(root);
  trimParagraphEdgeBreaks(root);
  removeSpacerParagraphs(root);
  promoteBoldOnlyParagraphHeadings(root);
  stripRedundantInlineStyles(root);
  cleanupEmptyElements(root);

  return root.innerHTML.trim();
}

/**
 * Storage cleaner for the editor:
 * keeps blank lines/spacers, but strips editor-only noise and redundant styles.
 */
export function cleanBlogHtmlForStorage(rawHtml: string): string {
  if (typeof document === "undefined") return rawHtml.trim();
  if (!rawHtml.trim()) return rawHtml;

  const root = document.createElement("div");
  root.innerHTML = rawHtml;

  root.querySelectorAll(".isSelectedEnd").forEach((el) => {
    el.classList.remove("isSelectedEnd");
  });

  // Keep editor structure/spacers intact; only strip noisy inline styles.
  stripRedundantInlineStyles(root);

  return root.innerHTML.trim();
}

function trimParagraphEdgeBreaks(root: HTMLElement) {
  root.querySelectorAll("p").forEach((p) => {
    if (p.querySelector("img")) return;

    // Remove leading/trailing <br> in paragraphs that also contain real text/content.
    // Keep a single <br> paragraph intact (handled later as spacer).
    const text = p.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    if (!text) return;

    while (p.firstChild && isVisualBreakNode(p.firstChild)) {
      p.removeChild(p.firstChild);
    }
    while (p.lastChild && isVisualBreakNode(p.lastChild)) {
      p.removeChild(p.lastChild);
    }
  });
}

function isVisualBreakNode(node: ChildNode): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !(node.textContent ?? "").replace(/\u00a0/g, " ").trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;
  if (el.tagName === "BR") return true;
  // Editors sometimes wrap a lone <br> in inline tags.
  if (/^(SPAN|B|STRONG|EM)$/i.test(el.tagName) && el.childNodes.length === 1) {
    const only = el.firstChild;
    return !!only && isVisualBreakNode(only as ChildNode);
  }
  return false;
}

function unwrapStructuralDivs(container: HTMLElement) {
  const skip = "table, td, th, ul, ol, li, blockquote, pre";

  let guard = 0;
  while (guard++ < 50) {
    const divs = Array.from(container.querySelectorAll("div")).filter(
      (d) => !d.closest(skip),
    );
    const candidate = divs.find((div) => isFlowOnlyWrapper(div));
    if (!candidate) break;

    const parent = candidate.parentNode;
    if (!parent) break;

    const marker = candidate;
    while (candidate.firstChild) {
      const child = candidate.firstChild;
      if (child.nodeType === Node.TEXT_NODE) {
        const raw = child.textContent ?? "";
        child.remove();
        const chunks = raw
          .split(/\n\s*\n/)
          .map((s) => s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim())
          .filter(Boolean);
        for (const text of chunks) {
          const p = document.createElement("p");
          p.appendChild(document.createTextNode(text));
          parent.insertBefore(p, marker);
        }
      } else {
        parent.insertBefore(child, marker);
      }
    }
    candidate.remove();
  }
}

function isFlowOnlyWrapper(div: HTMLDivElement): boolean {
  return Array.from(div.childNodes).every((n) => {
    if (n.nodeType === Node.TEXT_NODE) return true;
    if (n.nodeType !== Node.ELEMENT_NODE) return false;
    const tag = (n as Element).tagName;
    return /^P|H[1-6]|DIV|HR$/i.test(tag);
  });
}

function convertLeafDivsToParagraphs(root: HTMLElement) {
  root.querySelectorAll("div").forEach((div) => {
    if (div.closest("table, td, th, ul, ol, li, blockquote, pre")) return;
    if (div.querySelector("table, ul, ol, pre, blockquote, h1, h2, h3, h4, h5, h6, p, div"))
      return;

    const p = document.createElement("p");
    const style = div.getAttribute("style");
    if (style) p.setAttribute("style", style);
    p.innerHTML = div.innerHTML.trim() ? div.innerHTML : "<br>";
    div.replaceWith(p);
  });
}

function promoteBolderSpanTitles(root: HTMLElement) {
  root.querySelectorAll("p").forEach((p) => {
    const kids = Array.from(p.children);
    if (kids.length !== 1 || kids[0].tagName !== "SPAN") return;
    const span = kids[0] as HTMLSpanElement;
    const st = span.getAttribute("style") || "";
    if (!/font-weight\s*:\s*(bolder|bold|700)/i.test(st)) return;
    const strong = document.createElement("strong");
    strong.innerHTML = span.innerHTML;
    p.replaceChildren(strong);
  });
}

function splitBoldTitleBodyParagraphs(root: HTMLElement) {
  root.querySelectorAll("p").forEach((p) => {
    const first = p.firstElementChild;
    if (!first || (first.tagName !== "B" && first.tagName !== "STRONG")) return;
    if (first.previousSibling) return;

    let node: ChildNode | null = first.nextSibling;
    while (
      node &&
      node.nodeType === Node.TEXT_NODE &&
      !(node.textContent ?? "").replace(/\u00a0/g, " ").trim()
    ) {
      node = node.nextSibling;
    }
    if (!node) return;

    const newP = document.createElement("p");
    const style = p.getAttribute("style");
    const cls = p.getAttribute("class");
    if (style) newP.setAttribute("style", style);
    if (cls !== null && cls !== "") newP.setAttribute("class", cls);

    while (first.nextSibling) {
      newP.appendChild(first.nextSibling);
    }

    const bodyText = newP.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    if (!bodyText && newP.children.length === 0) return;

    p.parentNode?.insertBefore(newP, p.nextSibling);
  });
}

function removeSpacerParagraphs(root: HTMLElement) {
  root.querySelectorAll("p").forEach((p) => {
    if (p.querySelector("img")) return;

    const text = p.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    if (text !== "") return;

    const hasBr = p.querySelector("br");
    if (!hasBr && p.children.length > 0) return;

    // Editor "blank line" spacer paragraph.
    p.remove();
  });
}

function promoteBoldOnlyParagraphHeadings(root: HTMLElement) {
  // Many contenteditable editors save headings as <p><strong>Heading</strong></p>.
  // Promote those to semantic headings so frontend styling is predictable.
  root.querySelectorAll("p").forEach((p) => {
    const kids = Array.from(p.children);
    if (kids.length !== 1) return;
    const only = kids[0] as Element;
    if (only.tagName !== "STRONG" && only.tagName !== "B") return;

    const text = p.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    if (!text) return;

    // Heuristic: don't promote numbered list-ish items like "1. Learn ..." (keep as normal paragraph)
    if (/^\d+\.\s+/.test(text)) return;

    // Avoid promoting very long lines.
    if (text.length > 90) return;

    const h3 = document.createElement("h3");
    h3.innerHTML = only.innerHTML;
    p.replaceWith(h3);
  });
}

function stripRedundantInlineStyles(root: HTMLElement) {
  // Your app already sets letter-spacing on `body`. Editors tend to persist it inline everywhere,
  // which makes HTML noisy and can cause unexpected specificity issues later.
  const stripLetterSpacing = (style: string) =>
    style
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((decl) => !/^letter-spacing\s*:/i.test(decl))
      .join("; ");

  root.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const style = el.getAttribute("style");
    if (!style) return;
    const cleaned = stripLetterSpacing(style);
    if (!cleaned) el.removeAttribute("style");
    else el.setAttribute("style", cleaned);
  });
}

function cleanupEmptyElements(root: HTMLElement) {
  root.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, b, strong, em").forEach((el) => {
    const html = el.innerHTML.replace(/&nbsp;/gi, "").trim();
    if (!html) {
      if (el.tagName === "P") {
        // For rendering, drop truly empty paragraphs.
        el.remove();
      } else {
        el.remove();
      }
    }
  });
}
