"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useLazyGetSequencesByUserQuery,
} from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { Callout, Text, TextField } from "@radix-ui/themes";
import Link from "next/link";
import { SessionLoader } from "@/components/ui/spinner";
import { ViewSequence } from "@/components/ui/view-sequence";
import { Filter, Search } from "lucide-react";
import { SequenceEmptyState } from "@/components/sequence-empty-state";
import { SequenceErrorState } from "@/components/sequence-error-state";
import { CreateSequenceCta } from "@/components/create-sequence-cta";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import type { Sequence } from "./types";

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
  const queryParams = useMemo(() => ({ limit: 12 }), []);
  const canFetch = status === "authenticated";
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
    (canFetch && isLoading && Array.isArray(sequences) && sequences.length === 0);

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 3000);
    }
  }, [showCreationSuccess]);

  useEffect(() => {
    if (sequenceId) {
      sequenceIdRef.current = sequenceId;
      setIsViewDialogOpen(true);
    }
  }, [sequenceId]);

  if (isBusy) return <SessionLoader />;

  return (
    <div className="flex flex-col gap-4 px-6 py-0 sm:px-6">
      <div className="flex justify-between gap-6">
        <div>
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
              <Callout.Root color="green" role="status">
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
        <div>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
            <Filter className="h-5 w-5" aria-hidden="true" />
            <Text size="2" weight="medium" className="hidden sm:inline">
              {translate("common.filter")}
            </Text>
          </button>
        </div>
      </div>
      <div className="relative flex-1 md:max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9]">
          <Search className="h-5 w-5" aria-hidden="true" />
        </span>
        <TextField.Root
          type="text"
          placeholder={translate("common.search")}
          className="w-full rounded-lg border border-[#233348] bg-[#1a2533] pl-11 text-sm text-white placeholder:text-[#92a9c9] outline-none transition focus:border-[#136dec] focus:ring-1 focus:ring-[#136dec]"
        />
      </div>
      <section className="flex flex-col gap-4 pb-24">
        {!isError ? (
          <>
            {Array.isArray(sequences) && sequences.length > 0 ? (
              <InfiniteScroll
                dataLength={sequences.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center py-4">
                    <SessionLoader />
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
