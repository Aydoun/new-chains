"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLazyGetSequencesByUserQuery } from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { useTranslation } from "@/components/locale-provider";
import { Button, Spinner, Text, TextField } from "@radix-ui/themes";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataLoader, SessionLoader } from "@/components/ui/spinner";
import { ViewSequence } from "@/components/view-sequence";
import { Search, SquarePlus, X } from "lucide-react";
import { SequenceEmptyState } from "@/components/sequence-empty-state";
import { SequenceErrorState } from "@/components/sequence-error-state";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { PaginationParams, Sequence, TimeFilter } from "@/app/types";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { FilterDropdown } from "@/components/filter-dropdown";
import { useDebounce } from "use-debounce";
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_DEBOUNCE_DELAY,
  STUDIO_CREATE_PATH,
} from "@/lib/constants";

export default function Home({
  sequenceId,
}: {
  sequenceId: string | null | undefined;
}) {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);
  const sequenceIdRef = useRef<string | number | null>(null);
  const userId = session?.user?.id;
  const [fetchSequences] = useLazyGetSequencesByUserQuery();
  const initialParams = useMemo(
    () => ({
      limit: DEFAULT_PAGE_SIZE,
      timeFilter,
      search: debouncedSearch || undefined,
    }),
    [timeFilter, debouncedSearch],
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
  const isBusy =
    isLoading && Array.isArray(sequences) && sequences.length === 0;

  useEffect(() => {
    if (sequenceId) {
      sequenceIdRef.current = sequenceId;
      setIsViewDialogOpen(true);
    }
  }, [sequenceId]);

  // Sequences are created from the studio, which opens the form on arrival.
  const goToCreate = () => router.push(STUDIO_CREATE_PATH);

  const clearSearchAndFilter = () => {
    setSearchTerm("");
    setTimeFilter(undefined);
  };

  if (status === "loading") return <SessionLoader />;

  return (
    <div className="flex flex-col gap-4 px-6 py-0 px-6 mt-20 md:mt-6">
      <OnboardingChecklist onCreate={goToCreate} />
      <div className="flex gap-4 justify-between flex-wrap mb-4">
        <Text
          data-testid="homepage-title"
          className="self-center"
          weight="bold"
          size="6"
        >
          {t("navigation.explore")}
          <Text
            data-testid="homepage-description"
            weight="bold"
            size="3"
            className="text-amber-700"
            as="div"
          >
            {t("navigation.exploreDescription")}
          </Text>
        </Text>
        <div className="self-center">
          <Button
            onClick={goToCreate}
            className="cursor-pointer h-10 items-center px-4 text-sm font-bold bg-primary-main"
          >
            <SquarePlus />
            <Text size="2" weight="bold">
              {t("sequence.cta.label")}
            </Text>
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between">
        <div className="md:min-w-72">
          <TextField.Root
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder={t("common.search")}
            className="w-full rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none transition"
          >
            <TextField.Slot>
              <Search className="h-5 w-5 dark:text-white" aria-hidden="true" />
            </TextField.Slot>
            <TextField.Slot>
              <X
                onClick={() => setSearchTerm("")}
                size="20"
                className="cursor-pointer dark:text-white"
              />
            </TextField.Slot>
          </TextField.Root>
        </div>
        <div>
          <FilterDropdown value={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>
      <section className="mt-4 pb-24">
        {isBusy ? (
          <DataLoader />
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
                    onClear={clearSearchAndFilter}
                    onCreate={goToCreate}
                  />
                )}
              </>
            ) : (
              <SequenceErrorState />
            )}
          </>
        )}
      </section>
      {isViewDialogOpen && (
        <ViewSequence
          sequenceId={sequenceIdRef.current}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </div>
  );
}
