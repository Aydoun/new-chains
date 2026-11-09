"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Link2, Unlink } from "lucide-react";
import { Text } from "@radix-ui/themes";
import type { LibraryAsset } from "@/app/types";
import { useTranslation } from "@/components/locale-provider";
import { timeAgo } from "@/lib/utils";

/** How many sequence links a card shows before "+N more". */
export const VISIBLE_SEQUENCE_LINKS = 1;

type Props = { asset: LibraryAsset };

export function AssetCard({ asset }: Props) {
  const { t, locale } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { sequences } = asset;
  const hidden = sequences.length - VISIBLE_SEQUENCE_LINKS;
  const shown = expanded ? sequences : sequences.slice(0, VISIBLE_SEQUENCE_LINKS);

  return (
    <article
      data-testid="asset-card"
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="aspect-[4/3] w-full bg-muted">
        <Image
          src={asset.url}
          alt={sequences[0]?.title ?? t("assets.imageAlt")}
          width={asset.width}
          height={asset.height}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <Text size="1" weight="medium">
            <time
              dateTime={asset.createdAt}
              title={new Date(asset.createdAt).toLocaleString(locale)}
            >
              {t("assets.uploaded", { time: timeAgo(asset.createdAt, { locale }) })}
            </time>
          </Text>
        </div>

        {sequences.length === 0 ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Unlink className="h-4 w-4 shrink-0" aria-hidden="true" />
            <Text size="1">{t("assets.notUsed")}</Text>
          </div>
        ) : (
          <div className="flex items-start gap-1.5">
            <Link2
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-main"
              aria-hidden="true"
            />
            <ul
              aria-label={t("assets.usedIn")}
              className="flex min-w-0 flex-col gap-1"
            >
              {shown.map((sequence) => (
                <li key={sequence.id} className="min-w-0">
                  <Link
                    href={`/?sequence=${sequence.id}`}
                    className="block truncate text-sm font-medium text-primary-main hover:underline"
                  >
                    {sequence.title}
                  </Link>
                </li>
              ))}
              {hidden > 0 && (
                <li>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((value) => !value)}
                    className="cursor-pointer text-xs text-muted-foreground hover:underline"
                  >
                    {expanded
                      ? t("assets.showLess")
                      : t("assets.more", { count: hidden })}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
