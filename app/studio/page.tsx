"use client";

import { useSession } from "next-auth/react";
import {
  useDeleteSequenceMutation,
  useLazyGetStudioSequencesQuery,
} from "../services/sequences";
import { SessionLoader } from "@/components/ui/spinner";
import { translate } from "@/lib/i18n";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { Sequence } from "../types";
import { SequencePageContent } from "@/components/sequence-page-content";

export default function StudioPage() {
  const { data: session, status } = useSession();
  const [fetchStudioSequences] = useLazyGetStudioSequencesQuery();
  const studioQueryParams = { limit: 20 };
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<Sequence, { page?: number; limit?: number }>({
    fetchPage: (params) => fetchStudioSequences(params).unwrap(),
    initialParams: studioQueryParams,
    enabled: status === "authenticated",
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
    <SequencePageContent
      greeting={translate("studio.greetings", {
        name: session?.user?.name ?? "",
      })}
      sequences={sequences ?? []}
      hasMore={hasMore}
      isError={isError}
      loadMore={loadMore}
      handleDelete={handleDelete}
      viewerId={session?.user?.id}
    />
  );
}
