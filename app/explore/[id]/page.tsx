"use client";

import { useMemo, useState } from "react";
import { translate } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useLazyGetStudioSequencesQuery } from "@/app/services/sequences";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { Sequence, TimeFilter } from "@/app/types";
import { SessionLoader } from "@/components/ui/spinner";
import { useGetUserByIdQuery } from "@/app/services/users";
import { StudioView } from "@/components/studio-view";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm);

  const profileId = params?.id ?? "";

  const { data: user, isFetching: isFetchingUser } = useGetUserByIdQuery(
    profileId!,
    {
      skip: !profileId,
    }
  );
  const initialParams = useMemo(
    () => ({
      limit: 20,
      userId: profileId,
      timeFilter,
      search: debouncedSearch || undefined,
    }),
    [debouncedSearch, profileId, timeFilter]
  );
  const [fetchStudioSequences] = useLazyGetStudioSequencesQuery();
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<
    Sequence,
    {
      page?: number;
      limit?: number;
      userId?: string;
      timeFilter?: TimeFilter;
      search?: string;
    }
  >({
    fetchPage: (params) => fetchStudioSequences(params).unwrap(),
    initialParams,
  });
  const isBusy =
    status === "loading" ||
    isFetchingUser ||
    (isLoading && Array.isArray(sequences) && sequences.length === 0);
  const isError = Boolean(error);

  if (isBusy) return <SessionLoader />;

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
    />
  );
}
