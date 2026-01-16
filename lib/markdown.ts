"use client";

import { HtmlRenderer, Parser } from "commonmark";
import DOMPurify from "isomorphic-dompurify";

const parser = new Parser();
const renderer = new HtmlRenderer({ safe: true, softbreak: "<br />" });

export function renderMarkdown(markdown?: string | null) {
  if (!markdown) return "";

  const parsed = parser.parse(markdown);
  const html = renderer.render(parsed);

  return DOMPurify.sanitize(html);
}
