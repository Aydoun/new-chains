"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useDeleteSequenceMutation,
  useLazyGetStudioSequencesQuery,
} from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { PaginationParams, Sequence, TimeFilter } from "@/app/types";
import { StudioView } from "@/components/studio-view";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { useDebounce } from "use-debounce";

export default function StudioPage() {
  const { data: session, status } = useSession();
  const [fetchStudioSequences] = useLazyGetStudioSequencesQuery();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);
  const sequenceToDelete = useRef<string | number>("");
  const initialParams = useMemo(
    () => ({
      limit: DEFAULT_PAGE_SIZE,
      timeFilter,
      search: debouncedSearch || undefined,
    }),
    [timeFilter, debouncedSearch]
  );
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
    exludeItem,
  } = useInfinitePagination<Sequence, PaginationParams>({
    fetchPage: (params) => fetchStudioSequences(params).unwrap(),
    initialParams,
  });
  const [deleteSequence, { isLoading: isDeleting }] =
    useDeleteSequenceMutation();
  const isBusy = status === "loading" || isLoading;
  const isError = Boolean(error);

  const handleDelete = async (sequenceId: string | number) => {
    try {
      sequenceToDelete.current = sequenceId;
      await deleteSequence(sequenceId).unwrap();
      exludeItem(sequenceId);
    } catch (error) {
      console.error("Unable to delete sequence right now.", error);
    }
  };

  return (
    <StudioView
      greeting={translate("studio.greetings", {
        name: session?.user?.name ?? "",
      })}
      sequences={sequences}
      hasMore={hasMore}
      isError={isError}
      loadMore={loadMore}
      handleDelete={handleDelete}
      viewerId={session?.user?.id}
      filter={timeFilter}
      onFilterChange={setTimeFilter}
      deletingSequenceRef={isDeleting ? sequenceToDelete.current : ""}
      isLoading={isBusy}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isMyStudio
    />
  );
}
