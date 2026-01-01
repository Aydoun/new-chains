import { useCallback, useEffect, useState } from "react";

export type PaginatedResult<TItem> = {
  items: TItem[];
  page: number;
  hasMore: boolean;
  pageSize: number;
  nextPage: number | null;
};

type UseInfinitePaginationArgs<TItem, TParams extends object> = {
  fetchPage: (
    params: TParams & { page: number }
  ) => Promise<PaginatedResult<TItem>>;
  initialParams: TParams;
  initialPage?: number;
};

export function useInfinitePagination<TItem, TParams extends object>({
  fetchPage,
  initialParams,
  initialPage = 1,
}: UseInfinitePaginationArgs<TItem, TParams>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  const fetchAndSet = useCallback(
    async (pageToLoad: number, replace = false) => {
      setIsLoading(true);
      try {
        const result = await fetchPage({ ...initialParams, page: pageToLoad });

        setItems((prev) =>
          replace ? result.items : [...prev, ...result.items]
        );
        setHasMore(result.hasMore);
        setPage(pageToLoad + 1);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPage, initialParams]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchAndSet(page);
  }, [hasMore, isLoading]);

  useEffect(() => {
    setIsLoading(true);
    reset();
    fetchAndSet(initialPage, true);
  }, [initialPage, initialParams]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    loadMore,
    setItems,
  };
}
