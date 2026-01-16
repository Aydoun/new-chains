"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  content?: string | null;
  className?: string;
};

export function MarkdownRenderer({ content, className }: Props) {
  const sanitizedHtml = useMemo(() => renderMarkdown(content), [content]);

  if (!sanitizedHtml) return null;

  return (
    <div
      className={cn("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
