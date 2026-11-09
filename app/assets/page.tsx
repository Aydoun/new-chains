"use client";

import { useSession } from "next-auth/react";
import type { LibraryAsset } from "@/app/types";
import { useLazyGetAssetsQuery } from "@/app/services/assets";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { AssetsView } from "@/components/assets/assets-view";
import { SessionLoader } from "@/components/ui/spinner";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// Stable across renders: the hook refetches whenever its params change.
const INITIAL_PARAMS = { limit: DEFAULT_PAGE_SIZE };

export default function AssetsPage() {
  const { status } = useSession();
  const [fetchAssets] = useLazyGetAssetsQuery();
  const { items, hasMore, isLoading, error, loadMore, refresh } =
    useInfinitePagination<LibraryAsset, typeof INITIAL_PARAMS>({
      fetchPage: (params) => fetchAssets(params).unwrap(),
      initialParams: INITIAL_PARAMS,
    });

  if (status === "loading") return <SessionLoader />;

  return (
    <AssetsView
      assets={items}
      hasMore={hasMore}
      isLoading={isLoading && items.length === 0}
      isError={Boolean(error) && items.length === 0}
      loadMore={loadMore}
      onRetry={refresh}
    />
  );
}
