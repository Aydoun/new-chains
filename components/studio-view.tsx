"use client";

import { translate } from "@/lib/i18n";
import { timeAgo } from "@/lib/utils";
import {
  Button,
  Callout,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  Filter,
  History,
  Link as LinkIcon,
  Search,
  SquarePlus,
  type LucideIcon,
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useRef, useState } from "react";
import { Sequence, TimeFilter } from "@/app/types";
import { SequenceCard } from "./sequence-card";
import { SequenceEmptyState } from "./sequence-empty-state";
import { SequenceErrorState } from "./sequence-error-state";
import { ViewSequence } from "./view-sequence";
import { FilterDropdown } from "./filter-dropdown";
import { CreateSequenceForm } from "./ui/create-sequence";

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

type Props = {
  greeting: string;
  sequences: Sequence[];
  hasMore: boolean;
  isError: boolean;
  loadMore: () => void;
  handleDelete?: (sequenceId: string | number) => void;
  onFilterChange: (value: TimeFilter) => void;
  filter: TimeFilter;
  deletingSequenceRef?: string | number;
  viewerId?: string;
  omitAuthor?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export function StudioView({
  greeting,
  sequences,
  hasMore,
  isError,
  loadMore,
  handleDelete,
  viewerId,
  omitAuthor = true,
  onFilterChange,
  filter,
  deletingSequenceRef,
  searchTerm,
  onSearchChange,
}: Props) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const currentSequenceId = useRef<number | string | null>(null);

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 1000 * 10);
    }
  }, [showCreationSuccess]);

  return (
    <div className="flex w-full overflow-hidden mt-12 md:mt-6">
      <div className="flex w-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full flex-col gap-8 px-4 py-6 px-6 md:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap justify-between">
                <div className="self-center">
                  <Text size="6" weight="bold">
                    {greeting}
                  </Text>
                </div>
                <div className="min-h-[52px]">
                  {showCreationSuccess && (
                    <Callout.Root
                      className="mt-1 p-3 px-4"
                      color="green"
                      role="status"
                    >
                      <Callout.Text>
                        {translate("sequence.cta.creation-message")}{" "}
                      </Callout.Text>
                    </Callout.Root>
                  )}
                </div>
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
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                  >
                    <TextField.Slot>
                      <Search className="h-5 w-5" aria-hidden="true" />
                    </TextField.Slot>
                  </TextField.Root>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="mx-1 hidden h-8 w-px bg-[#233348] md:block" />
                  <FilterDropdown value={filter} onChange={onFilterChange} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="surface"
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex cursor-pointer h-10 w-60 items-center gap-2 px-4 text-sm font-bold"
                >
                  <SquarePlus />
                  <Text size="2" weight="bold" className="tracking-[0.015em]">
                    {translate("sequence.cta.label")}
                  </Text>
                </Button>
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
                            <Spinner />
                          </div>
                        }
                        endMessage={<Separator className="mt-6 w-full" />}
                      >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {sequences?.map((sequence) => (
                            <SequenceCard
                              key={sequence.id}
                              userId={viewerId}
                              sequence={sequence}
                              handleDelete={handleDelete}
                              omitAuthor={omitAuthor}
                              onClick={() => {
                                currentSequenceId.current = sequence.id;
                                setIsViewDialogOpen(true);
                              }}
                              deletingSequenceRef={deletingSequenceRef}
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

      {isCreateDialogOpen && (
        <CreateSequenceForm
          onClose={() => {
            setIsCreateDialogOpen(false);
          }}
          initialSequenceTitle=""
          onSequenceCreated={() => setShowCreationSuccess(true)}
        />
      )}
    </div>
  );
}
