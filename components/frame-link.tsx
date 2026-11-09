"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { FRAME_LINK_REL, safeFrameLink } from "@/lib/frame-link";
import { cn } from "@/lib/utils";

type Props = {
  linkUrl?: string | null;
  children: ReactNode;
  className?: string;
};

/**
 * Makes a frame's content open its link in a new tab, with the usual
 * external-link cue: the destination's host and a ↗ icon under the text.
 * Without a (safe) link the content renders as is.
 */
export function FrameLink({ linkUrl, children, className }: Props) {
  const { t } = useTranslation();
  const link = safeFrameLink(linkUrl);
  if (!link) return <>{children}</>;

  return (
    <a
      href={link.url}
      target="_blank"
      rel={FRAME_LINK_REL}
      data-testid="frame-link"
      title={link.url}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-600",
        className,
      )}
    >
      {children}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 group-hover:underline">
        {link.host}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
        {/* The space keeps screen readers from running it into the host;
            whitespace between flex items isn't drawn. */}{" "}
        <span className="sr-only">{t("frame.link.opensInNewTab")}</span>
      </span>
    </a>
  );
}
