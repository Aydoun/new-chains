"use client";

import { translate } from "@/lib/i18n";
import { Text, TextField } from "@radix-ui/themes";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Sequence, TimeFilter } from "@/app/types";
import { ViewSequence } from "./view-sequence";
import { FilterDropdown } from "./filter-dropdown";
import { SequenceList } from "./sequence-list";

type Props = {
  greeting: string;
  sequences: Sequence[];
  hasMore: boolean;
  isError: boolean;
  loadMore: () => void;
  isLoading: boolean;
  onFilterChange: (value: TimeFilter) => void;
  filter: TimeFilter;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewerId?: string;
};

export function ExplorerPageView({
  greeting,
  sequences,
  hasMore,
  isError,
  loadMore,
  isLoading,
  onFilterChange,
  filter,
  searchTerm,
  onSearchChange,
  viewerId,
}: Props) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const currentSequenceId = useRef<number | string | null>(null);

  return (
    <div className="flex w-full overflow-hidden mt-12 md:mt-6">
      <div className="flex w-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full flex-col gap-8 px-4 py-6 px-6 md:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="self-center">
                  <Text size="6" weight="bold">
                    {greeting}
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap py-2 justify-between gap-3">
                <div className="md:min-w-72">
                  <TextField.Root
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={translate("common.search")}
                    className="w-full rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <TextField.Slot>
                      <Search
                        className="h-5 w-5 dark:text-white"
                        aria-hidden="true"
                      />
                    </TextField.Slot>
                    <TextField.Slot>
                      <X
                        onClick={() => onSearchChange("")}
                        size="20"
                        className="cursor-pointer dark:text-white"
                      />
                    </TextField.Slot>
                  </TextField.Root>
                </div>
                <div className="flex gap-3">
                  <FilterDropdown value={filter} onChange={onFilterChange} />
                </div>
              </div>
              <section className="mt-4 pb-24">
                <SequenceList
                  sequences={sequences}
                  hasMore={hasMore}
                  isError={isError}
                  isLoading={isLoading}
                  loadMore={loadMore}
                  viewerId={viewerId}
                  onSequenceSelect={(sequenceId) => {
                    currentSequenceId.current = sequenceId;
                    setIsViewDialogOpen(true);
                  }}
                  onClearSearch={() => onSearchChange("")}
                />
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
