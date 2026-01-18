"use client";

import { translate } from "@/lib/i18n";
import { Button, Callout, Spinner, Text, TextField } from "@radix-ui/themes";
import { Heart, Search, Sparkles, SquarePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sequence, SequenceTemplate, Snippet, TimeFilter } from "@/app/types";
import { sequenceTemplates } from "@/app/templates/config";
import { ViewSequence } from "./view-sequence";
import { FilterDropdown } from "./filter-dropdown";
import { CreateSequenceForm } from "./ui/create-sequence";
import { SequenceTemplateSelector } from "./sequence-template-selector";
import clsx from "clsx";
import { useLazyGetSnippetsQuery } from "@/app/services/snippets";
import { SnippetCard } from "./ui/snippetCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { SequenceList } from "./sequence-list";

const FAVORITES_PAGE_SIZE = 4;

type Props = {
  greeting: string;
  sequences: Sequence[];
  hasMore: boolean;
  isError: boolean;
  loadMore: () => void;
  handleDelete?: (sequenceId: string | number) => void;
  isLoading: boolean;
  onFilterChange: (value: TimeFilter) => void;
  filter: TimeFilter;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  deletingSequenceRef?: string | number;
  viewerId?: string;
};

export function StudioPageView({
  greeting,
  sequences,
  hasMore,
  isError,
  isLoading,
  loadMore,
  handleDelete,
  viewerId,
  onFilterChange,
  filter,
  searchTerm,
  onSearchChange,
  deletingSequenceRef,
}: Props) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [favoritesToggle, setFavoritesToggle] = useState(false);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SequenceTemplate | null>(null);
  const currentSequenceId = useRef<number | string | null>(null);

  const [fetchSnippets, { data, isFetching }] = useLazyGetSnippetsQuery();

  const favorites = useMemo(() => data ?? [], [data]);
  const favoritesVisible = useMemo(
    () => favorites.slice(0, favoritesPage * FAVORITES_PAGE_SIZE),
    [favorites, favoritesPage]
  );
  const favoritesHasMore = favoritesVisible.length < favorites.length;

  const handleTemplateSelect = (template: SequenceTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateDialogOpen(false);
    setIsCreateDialogOpen(true);
  };

  const handleFavoritesToggle = () => {
    setFavoritesToggle((prev) => !prev);
  };

  const loadMoreFavorites = () => {
    setFavoritesPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (favoritesToggle && !data && !isFetching) {
      fetchSnippets();
    }
  }, [favoritesToggle, data, isFetching, fetchSnippets]);

  useEffect(() => {
    if (favoritesToggle) {
      setFavoritesPage(1);
    }
  }, [favoritesToggle, data]);

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
              <div className="flex flex-wrap justify-between gap-4">
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
                        {translate("sequence.cta.creation-message")}
                      </Callout.Text>
                    </Callout.Root>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 self-center">
                  <Button
                    variant="soft"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setIsTemplateDialogOpen(true);
                    }}
                    className="flex h-10 items-center gap-2 px-4 text-sm font-bold cursor-pointer hidden md:flex"
                  >
                    <Sparkles />
                    <Text size="2" weight="bold" className="tracking-[0.015em]">
                      {translate("studio.template-create")}
                    </Text>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreateDialogOpen(true);
                    }}
                    className="flex cursor-pointer h-10 w-60 items-center gap-2 px-4 text-sm font-bold bg-primary-main"
                  >
                    <SquarePlus />
                    <Text size="2" weight="bold" className="tracking-[0.015em]">
                      {translate("sequence.cta.label")}
                    </Text>
                  </Button>
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
                  <div className="self-center">
                    <button
                      type="button"
                      className={clsx(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-accent hover:text-foreground",
                        {
                          "bg-primary-main text-white hover:bg-primary-main":
                            favoritesToggle,
                        }
                      )}
                      aria-pressed={favoritesToggle}
                      onClick={handleFavoritesToggle}
                    >
                      <Heart className="h-5 w-5" aria-hidden="true" />
                      <Text size="2" weight="medium" className="hidden sm:inline">
                        {translate("common.favorites")}
                      </Text>
                    </button>
                  </div>
                  <FilterDropdown value={filter} onChange={onFilterChange} />
                </div>
              </div>
              {favoritesToggle && (
                <section className="mt-2 rounded-2xl border border-border/40 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <Text weight="bold">
                      {translate("common.favorites")}
                    </Text>
                    {isFetching && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Spinner size="1" />
                        {translate("common.loading")}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-4">
                    {isFetching && favoritesVisible.length === 0 ? (
                      <div className="flex justify-center py-6">
                        <Spinner />
                      </div>
                    ) : favoritesVisible.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                        {translate("snippets.drawer.empty")}
                      </div>
                    ) : (
                      <InfiniteScroll
                        dataLength={favoritesVisible.length}
                        next={loadMoreFavorites}
                        hasMore={favoritesHasMore}
                        loader={
                          <div className="flex justify-center py-3">
                            <Spinner />
                          </div>
                        }
                      >
                        <div className="flex flex-col gap-4">
                          {favoritesVisible.map((snippet: Snippet) => (
                            <SnippetCard key={snippet.id} snippet={snippet} />
                          ))}
                        </div>
                      </InfiniteScroll>
                    )}
                  </div>
                </section>
              )}
              <section className="mt-4 pb-24">
                <SequenceList
                  sequences={sequences}
                  hasMore={hasMore}
                  isError={isError}
                  isLoading={isLoading}
                  loadMore={loadMore}
                  viewerId={viewerId}
                  handleDelete={handleDelete}
                  deletingSequenceRef={deletingSequenceRef}
                  onSequenceSelect={(sequenceId) => {
                    currentSequenceId.current = sequenceId;
                    setIsViewDialogOpen(true);
                  }}
                  onClearSearch={() => onSearchChange("")}
                  onCreate={() => setIsCreateDialogOpen(true)}
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

      {isTemplateDialogOpen && (
        <SequenceTemplateSelector
          open={isTemplateDialogOpen}
          onOpenChange={setIsTemplateDialogOpen}
          templates={sequenceTemplates}
          onSelect={handleTemplateSelect}
        />
      )}

      {isCreateDialogOpen && (
        <CreateSequenceForm
          onClose={() => {
            setSelectedTemplate(null);
            setIsCreateDialogOpen(false);
          }}
          initialSequenceTitle={selectedTemplate?.title ?? ""}
          initialTemplate={selectedTemplate}
          onSequenceCreated={() => {
            setShowCreationSuccess(true);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}
