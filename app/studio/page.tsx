"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TimeFilter,
  useDeleteSequenceMutation,
  useLazyGetStudioSequencesQuery,
} from "@/app/services/sequences";
import { SessionLoader } from "@/components/ui/spinner";
import { translate } from "@/lib/i18n";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { Sequence } from "@/app/types";
import { StudioView } from "@/components/studio-view";

export default function StudioPage() {
  const { data: session, status } = useSession();
  const [fetchStudioSequences] = useLazyGetStudioSequencesQuery();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const initialParams = useMemo(
    () => ({ limit: 20, timeFilter }),
    [timeFilter]
  );
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<
    Sequence,
    { page?: number; limit?: number; timeFilter?: TimeFilter }
  >({
    fetchPage: (params) => fetchStudioSequences(params).unwrap(),
    initialParams,
  });
  const [deleteSequence, { isLoading: isDeleting }] =
    useDeleteSequenceMutation();
  const isBusy =
    status === "loading" ||
    (isLoading && Array.isArray(sequences) && sequences.length === 0);
  const isError = Boolean(error);

  const handleDelete = async (sequenceId: string | number) => {
    try {
      await deleteSequence(sequenceId).unwrap();
    } catch (error) {
      console.error("Unable to delete sequence right now.", error);
    }
  };

  if (isBusy) return <SessionLoader />;

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
    />
  );
}
