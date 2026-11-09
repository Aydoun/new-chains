"use client";

import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import type { FrameAsset } from "@/app/types";
import { FrameLink } from "./frame-link";
import { safeFrameLink } from "@/lib/frame-link";

type Props = {
  asset: FrameAsset;
  text: string;
  description?: string | null;
  liked?: boolean;
  showIsLiked?: boolean;
  onLike?: () => void;
  /** Opens in a new tab when the picture or its caption is clicked. */
  linkUrl?: string | null;
};

/**
 * An IMAGE frame: the whole picture, uncropped (portrait to landscape, see
 * IMAGE_RULES), with the frame's text as its caption.
 */
export const ImageFrame: FC<Props> = ({
  asset,
  text,
  description,
  liked,
  showIsLiked = true,
  onLike,
  linkUrl,
}) => {
  const { t } = useTranslation();
  const Caption = safeFrameLink(linkUrl) ? "div" : "figcaption";

  return (
    <figure
      data-testid="image-frame"
      className="relative flex w-full flex-col items-center gap-3 rounded-lg bg-frame-primary p-3"
    >
      <FrameLink linkUrl={linkUrl} className="w-full gap-3" overImage>
        <Image
          src={asset.url}
          alt={text}
          width={asset.width}
          height={asset.height}
          unoptimized
          className="h-auto max-h-[60vh] w-auto max-w-full rounded-md object-contain"
        />
        {/* A figcaption must sit directly in the figure, so inside a link it's a div. */}
        <Caption className="flex flex-col items-center gap-1 px-8 text-center">
          <p className="font-serif text-lg leading-tight text-gray-800 md:text-xl">
            {text}
          </p>
          {description && (
            <p className="text-sm font-medium text-amber-700">{description}</p>
          )}
        </Caption>
      </FrameLink>
      {showIsLiked && (
        <button
          type="button"
          aria-label={t("snippets.saveAction")}
          aria-pressed={Boolean(liked)}
          onClick={onLike}
          className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/80 p-1"
        >
          <Heart
            fill={liked ? "red" : "none"}
            className={clsx("h-5 w-5", { "text-primary-main": !liked })}
            aria-hidden="true"
          />
        </button>
      )}
    </figure>
  );
};
