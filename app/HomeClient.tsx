"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetSequencesByUserQuery,
  useLazyGetSequencesByUserQuery,
} from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { Callout, Text, TextField } from "@radix-ui/themes";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { SessionLoader } from "@/components/ui/spinner";
import { ViewSequence } from "@/components/ui/view-sequence";
import { Filter, Search } from "lucide-react";
import { SequenceEmptyState } from "@/components/sequence-empty-state";
import { SequenceErrorState } from "@/components/sequence-error-state";
import { CreateSequenceCta } from "@/components/create-sequence-cta";
import { Sequence } from "./types";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";

export default function Home({
  sequenceId,
}: {
  sequenceId: string | null | undefined;
}) {
  const { data: session, status } = useSession();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const sequenceIdRef = useRef<string | number | null>(null);
  const sequenceTitleRef = useRef<string>("");
  const userId = session?.user?.id;
  const [fetchSequences] = useLazyGetSequencesByUserQuery();
  const queryParams = { limit: 20 };
  const canFetch = status === "authenticated";
  // const {
  //   data: sequences,
  //   isLoading,
  //   isFetching,
  //   isError,
  // } = useGetSequencesByUserQuery(userId ?? skipToken);
  // const isPending = isLoading || isFetching;
  const {
    items: sequences,
    hasMore,
    isLoading,
    error,
    loadMore,
  } = useInfinitePagination<Sequence, { userId?: string; limit?: number }>({
    fetchPage: (params) => fetchSequences(params).unwrap(),
    initialParams: queryParams,
    enabled: canFetch,
  });
  const isError = Boolean(error);
  const isBusy =
    status === "loading" ||
    (canFetch &&
      isLoading &&
      Array.isArray(sequences) &&
      sequences.length === 0);

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 5000);
    }
  }, [showCreationSuccess]);

  useEffect(() => {
    if (sequenceId) {
      sequenceIdRef.current = sequenceId;
      setIsViewDialogOpen(true);
    }
  }, [sequenceId]);

  console.log({ isBusy });

  if (isBusy) return <SessionLoader />;

  return (
    <div className="flex flex-col gap-4 px-6 py-0 sm:px-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Text
            data-testid="homepage-title"
            className="self-center"
            weight="bold"
            size="6"
          >
            {translate("navigation.explore")}
          </Text>
          <div className="min-h-[52px]">
            {showCreationSuccess && (
              <Callout.Root
                className="mt-1 p-3 px-4"
                color="green"
                role="status"
              >
                <Callout.Text>
                  {translate("sequence.cta.creation-message")}{" "}
                  <Link
                    href="/studio"
                    className="font-semibold underline underline-offset-4"
                  >
                    {translate("navigation.cta.studio-redirect")}
                  </Link>
                </Callout.Text>
              </Callout.Root>
            )}
          </div>
        </div>
        <div className="self-center">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
            <Filter className="h-5 w-5" aria-hidden="true" />
            <Text size="2" weight="medium" className="hidden sm:inline">
              {translate("common.filter")}
            </Text>
          </button>
        </div>
      </div>
      <div className="relative flex-1 md:max-w-md">
        <TextField.Root
          type="text"
          placeholder={translate("common.search")}
          className="w-full rounded-lg border border-[#233348] text-sm text-white placeholder:text-[#92a9c9] outline-none transition"
        >
          <TextField.Slot>
            <Search className="h-5 w-5" aria-hidden="true" />
          </TextField.Slot>
        </TextField.Root>
      </div>
      <section className="mt-4 pb-24">
        {!isError ? (
          <>
            {Array.isArray(sequences) && sequences.length > 0 ? (
              <InfiniteScroll
                dataLength={sequences.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center py-4">
                    <p>Hey babe</p>
                  </div>
                }
                endMessage={
                  <Text
                    as="p"
                    size="2"
                    className="py-4 text-center text-[#92a9c9]"
                  >
                    {translate("common.endOfFeed")}
                  </Text>
                }
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sequences?.map((sequence) => (
                    <SequenceCard
                      key={sequence.id}
                      userId={userId}
                      sequence={sequence}
                      onClick={() => {
                        setIsViewDialogOpen(true);
                        sequenceIdRef.current = sequence.id;
                      }}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            ) : (
              <SequenceEmptyState />
            )}
          </>
        ) : (
          <SequenceErrorState />
        )}
      </section>
      <CreateSequenceCta
        onCreate={(title) => {
          sequenceTitleRef.current = title;
          setIsCreateDialogOpen(true);
        }}
      />

      {isViewDialogOpen && (
        <ViewSequence
          sequenceId={sequenceIdRef.current}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
      {isCreateDialogOpen && (
        <CreateSequenceForm
          onClose={() => {
            setIsCreateDialogOpen(false);
          }}
          initialSequenceTitle={sequenceTitleRef.current}
          onSequenceCreated={() => setShowCreationSuccess(true)}
        />
      )}
    </div>
  );
}
