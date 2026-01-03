"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useLazyGetSequencesByUserQuery } from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { Callout, Separator, Spinner, Text, TextField } from "@radix-ui/themes";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { SessionLoader } from "@/components/ui/spinner";
import { ViewSequence } from "@/components/view-sequence";
import { Search, X } from "lucide-react";
import { SequenceEmptyState } from "@/components/sequence-empty-state";
import { SequenceErrorState } from "@/components/sequence-error-state";
import { CreateSequenceCta } from "@/components/create-sequence-cta";
import { PaginationParams, Sequence, TimeFilter } from "@/app/types";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { FilterDropdown } from "@/components/filter-dropdown";
import { useDebounce } from "use-debounce";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";

export default function Home({
  sequenceId,
}: {
  sequenceId: string | null | undefined;
}) {
  const { data: session, status } = useSession();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);
  const sequenceIdRef = useRef<string | number | null>(null);
  const sequenceTitleRef = useRef<string>("");
  const userId = session?.user?.id;
  const [fetchSequences] = useLazyGetSequencesByUserQuery();
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
  } = useInfinitePagination<Sequence, PaginationParams>({
    fetchPage: (params) => fetchSequences(params).unwrap(),
    initialParams,
  });
  const isError = Boolean(error);
  const isBusy = status === "loading" || isLoading;

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 1000 * 10);
    }
  }, [showCreationSuccess]);

  useEffect(() => {
    if (sequenceId) {
      sequenceIdRef.current = sequenceId;
      setIsViewDialogOpen(true);
    }
  }, [sequenceId]);

  return (
    <div className="flex flex-col gap-4 px-6 py-0 px-6 mt-20 md:mt-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Text
            data-testid="homepage-title"
            className="self-center"
            weight="bold"
            size="6"
          >
            {translate("navigation.explore")}
            <Text
              data-testid="homepage-description"
              weight="bold"
              size="3"
              className="text-amber-700"
              as="div"
            >
              {translate("navigation.exploreDescription")}
            </Text>
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
          <FilterDropdown value={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>
      <div className="relative flex-1 md:max-w-md">
        <TextField.Root
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder={translate("common.search")}
          className="w-full rounded-lg border border-[#233348] text-sm text-white placeholder:text-[#92a9c9] outline-none transition"
        >
          <TextField.Slot>
            <Search className="h-5 w-5" aria-hidden="true" />
          </TextField.Slot>
          <TextField.Slot>
            <X
              onClick={() => setSearchTerm("")}
              size="20"
              className="cursor-pointer"
            />
          </TextField.Slot>
        </TextField.Root>
      </div>
      <section className="mt-4 pb-24">
        {isBusy ? (
          <SessionLoader />
        ) : (
          <>
            {!isError ? (
              <>
                {Array.isArray(sequences) && sequences.length > 0 ? (
                  <InfiniteScroll
                    dataLength={sequences.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
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
                  <SequenceEmptyState
                    onClear={() => setSearchTerm("")}
                    onCreate={() => setIsCreateDialogOpen(true)}
                  />
                )}
              </>
            ) : (
              <SequenceErrorState />
            )}
          </>
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
