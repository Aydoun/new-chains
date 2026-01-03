"use client";

import { useMemo, useState } from "react";
import { translate } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useLazyGetStudioSequencesQuery } from "@/app/services/sequences";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { PaginationParams, Sequence, TimeFilter } from "@/app/types";
import { SessionLoader } from "@/components/ui/spinner";
import { useGetUserByIdQuery } from "@/app/services/users";
import { StudioView } from "@/components/studio-view";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { useDebounce } from "use-debounce";

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  const profileId = params?.id ?? "";

  const { data: user, isFetching: isFetchingUser } = useGetUserByIdQuery(
    profileId!,
    {
      skip: !profileId,
    }
  );
  const initialParams = useMemo(
    () => ({
      limit: DEFAULT_PAGE_SIZE,
      timeFilter,
      search: debouncedSearch || undefined,
      userId: profileId,
    }),
    [timeFilter, debouncedSearch]
  );

  const [fetchStudioSequences] = useLazyGetStudioSequencesQuery();
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<Sequence, PaginationParams>({
    fetchPage: (params) => fetchStudioSequences(params).unwrap(),
    initialParams,
  });
  const isBusy =
    isFetchingUser ||
    (isLoading && Array.isArray(sequences) && sequences.length === 0);
  const isError = Boolean(error);

  if (status === "loading") return <SessionLoader />;

  return (
    <StudioView
      greeting={translate("studio.explorerWelcome", {
        name: user?.username ?? "",
      })}
      sequences={sequences ?? []}
      hasMore={hasMore}
      isError={isError}
      loadMore={loadMore}
      viewerId={session?.user?.id}
      filter={timeFilter}
      onFilterChange={setTimeFilter}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isLoading={isBusy}
    />
  );
}
