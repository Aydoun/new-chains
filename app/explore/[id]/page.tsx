"use client";

import { translate } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SequencePageContent } from "@/components/sequence-page-content";
import {
  useDeleteSequenceMutation,
  useLazyGetSequencesByUserQuery,
} from "@/app/services/sequences";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { Sequence } from "@/app/types";
import { SessionLoader } from "@/components/ui/spinner";
import { useGetUserByIdQuery } from "@/app/services/users";

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const profileId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params?.id?.[0]
        : undefined;
  const { data: user, isFetching: isFetchingUser } = useGetUserByIdQuery(
    profileId!,
    {
      skip: !profileId,
    }
  );
  const [fetchUserSequences] = useLazyGetSequencesByUserQuery();
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<
    Sequence,
    { page?: number; limit?: number; userId?: string }
  >({
    fetchPage: (params) => fetchUserSequences(params).unwrap(),
    initialParams: { limit: 20, userId: profileId },
    enabled: Boolean(profileId),
  });
  const [deleteSequence] = useDeleteSequenceMutation();
  const isBusy =
    status === "loading" ||
    isFetchingUser ||
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
        name: user?.username ?? "",
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
