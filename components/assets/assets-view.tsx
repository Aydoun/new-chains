"use client";

import Link from "next/link";
import { Images, SquarePlus } from "lucide-react";
import { Button, Heading, Spinner, Text } from "@radix-ui/themes";
import InfiniteScroll from "react-infinite-scroll-component";
import type { LibraryAsset } from "@/app/types";
import { useTranslation } from "@/components/locale-provider";
import { DataLoader } from "@/components/ui/spinner";
import { STUDIO_CREATE_PATH } from "@/lib/constants";
import { AssetCard } from "./asset-card";

type Props = {
  assets: LibraryAsset[];
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  loadMore: () => void;
  onRetry: () => void;
};

export function AssetsView({
  assets,
  hasMore,
  isLoading,
  isError,
  loadMore,
  onRetry,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="mt-12 md:mt-6">
      <div className="mx-auto flex flex-col gap-8 px-6 py-6 md:px-10">
        <div className="space-y-1">
          <Heading as="h1" size="6">
            {t("assets.title")}
          </Heading>
          <Text as="p" size="2" className="text-muted-foreground">
            {t("assets.description")}
          </Text>
        </div>

        {isLoading ? (
          <DataLoader className="mt-48" />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Text size="2" className="text-muted-foreground">
              {t("assets.loadError")}
            </Text>
            <Button variant="soft" onClick={onRetry}>
              {t("assets.retry")}
            </Button>
          </div>
        ) : assets.length === 0 ? (
          <div
            data-testid="assets-empty"
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center"
          >
            <Images className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <Heading as="h2" size="4">
              {t("assets.empty.title")}
            </Heading>
            <Text as="p" size="2" className="text-muted-foreground">
              {t("assets.empty.description")}
            </Text>
            <Button asChild className="mt-2 cursor-pointer bg-primary-main">
              <Link href={STUDIO_CREATE_PATH}>
                <SquarePlus className="h-4 w-4" aria-hidden="true" />
                {t("assets.empty.cta")}
              </Link>
            </Button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={assets.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
