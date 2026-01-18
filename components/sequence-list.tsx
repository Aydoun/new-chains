import { Sequence } from "@/app/types";
import { SequenceCard } from "./sequence-card";
import { SequenceEmptyState } from "./sequence-empty-state";
import { SequenceErrorState } from "./sequence-error-state";
import { DataLoader } from "./ui/spinner";
import { Spinner } from "@radix-ui/themes";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  sequences: Sequence[];
  hasMore: boolean;
  isError: boolean;
  isLoading: boolean;
  loadMore: () => void;
  viewerId?: string;
  handleDelete?: (sequenceId: string | number) => void;
  deletingSequenceRef?: string | number;
  onSequenceSelect: (sequenceId: string | number) => void;
  onClearSearch: () => void;
  onCreate?: () => void;
};

export function SequenceList({
  sequences,
  hasMore,
  isError,
  isLoading,
  loadMore,
  viewerId,
  handleDelete,
  deletingSequenceRef,
  onSequenceSelect,
  onClearSearch,
  onCreate,
}: Props) {
  if (isLoading) {
    return <DataLoader className="mt-64 md:mt-48" />;
  }

  if (isError) {
    return <SequenceErrorState />;
  }

  if (!Array.isArray(sequences) || sequences.length === 0) {
    return (
      <SequenceEmptyState
        onClear={onClearSearch}
        {...(onCreate && { onCreate: () => onCreate() })}
      />
    );
  }

  return (
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
        {sequences.map((sequence) => (
          <SequenceCard
            key={sequence.id}
            userId={viewerId}
            sequence={sequence}
            handleDelete={handleDelete}
            omitAuthor
            onClick={() => onSequenceSelect(sequence.id)}
            deletingSequenceRef={deletingSequenceRef}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
