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
  /** Over a picture: give the icon a light round backing, like the heart's. */
  overImage?: boolean;
};

/**
 * Makes a frame's content open its link in a new tab. The only visual cue is
 * the standard external-link icon in the frame's top-left corner (the save
 * heart has the top-right); the address itself isn't shown, the browser
 * shows it on hover. Without a (safe) link the content renders as is.
 */
export function FrameLink({ linkUrl, children, className, overImage = false }: Props) {
  const { t } = useTranslation();
  const link = safeFrameLink(linkUrl);
  if (!link) return <>{children}</>;

  return (
    <a
      href={link.url}
      target="_blank"
      rel={FRAME_LINK_REL}
      data-testid="frame-link"
      className={cn(
        "flex flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-600",
        className,
      )}
    >
      {children}
      {/* Positioned against the frame, which is `relative`. */}
      <span
        data-testid="frame-link-icon"
        aria-hidden="true"
        className={cn(
          "absolute left-4 top-4 text-gray-600",
          overImage && "rounded-full bg-white/80 p-1.5",
        )}
      >
        <ExternalLink className="h-4 w-4" />
      </span>
      {/* The space keeps screen readers from running it into the text;
          whitespace between flex items isn't drawn. */}{" "}
      <span className="sr-only">{t("frame.link.opensInNewTab")}</span>
    </a>
  );
}
