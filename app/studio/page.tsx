"use client";

import { Text, TextField } from "@radix-ui/themes";
import {
  Filter,
  History,
  Link as LinkIcon,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useDeleteSequenceMutation,
  useLazyGetStudioSequencesQuery,
} from "../services/sequences";
import { SessionLoader } from "@/components/ui/spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { timeAgo } from "@/lib/utils";
import { SequenceCard } from "@/components/sequence-card";
import { translate } from "@/lib/i18n";
import { ViewSequence } from "@/components/ui/view-sequence";
import { useRef, useState } from "react";
import { SequenceErrorState } from "@/components/sequence-error-state";
import { SequenceEmptyState } from "@/components/sequence-empty-state";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { Sequence } from "../types";

type StatCard = {
  icon: LucideIcon;
  labelKey: string;
};

const stats: StatCard[] = [
  {
    labelKey: "studio.total",
    icon: LinkIcon,
  },
  {
    labelKey: "studio.lastEdit",
    icon: History,
  },
];

export default function StudioPage() {
  const { data: session, status } = useSession();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const currentSequenceId = useRef<number | string | null>(null);
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
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full overflow-hidden rounded-xl ">
      <div className="flex w-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Text
                    size="6"
                    weight="bold"
                    className="tracking-[-0.033em] text-white sm:text-[38px]"
                  >
                    {translate("studio.greetings", {
                      name: session?.user?.name ?? "",
                    })}
                  </Text>
                </div>
                {/* <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#233348] bg-[#1a2533] px-4 text-sm font-bold text-white transition-colors hover:border-[#136dec]/50">
                  <SquarePlus />
                  <Text
                    size="2"
                    weight="bold"
                    className="tracking-[0.015em]"
                  >
                    Create Sequence
                  </Text>
                </button> */}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                  <div
                    key={stat.labelKey}
                    className="flex flex-col gap-3 rounded-xl border border-[#233348] bg-[#1a2533]/70 p-5 transition-colors hover:bg-[#1a2533]"
                  >
                    <div className="flex items-start justify-between">
                      <Text size="2" weight="medium" className="text-[#92a9c9]">
                        {translate(stat.labelKey)}
                      </Text>
                      <stat.icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Text
                        size="7"
                        weight="bold"
                        className="leading-tight text-white"
                      >
                        {index === 0
                          ? sequences.length ?? 0
                          : timeAgo(sequences[0]?.updatedAt)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 py-2 md:flex-row md:items-center md:justify-between">
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
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="mx-1 hidden h-8 w-px bg-[#233348] md:block" />
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
                    <Filter className="h-5 w-5" aria-hidden="true" />
                    <Text size="2" weight="medium" className="hidden sm:inline">
                      {translate("common.filter")}
                    </Text>
                  </button>
                </div>
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
                            <Text>{translate("common.loading")}</Text>
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
                              userId={session?.user?.id}
                              sequence={sequence}
                              handleDelete={handleDelete}
                              omitAuthor
                              onClick={() => {
                                currentSequenceId.current = sequence.id;
                                setIsViewDialogOpen(true);
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
            </div>
          </div>
        </div>
      </div>
      {isViewDialogOpen && (
        <ViewSequence
          sequenceId={currentSequenceId.current}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </div>
  );
}
