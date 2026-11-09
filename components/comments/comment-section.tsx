"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button, Spinner, Text } from "@radix-ui/themes";
import { useTranslation } from "@/components/locale-provider";
import {
  useDeleteCommentMutation,
  useGetCommentsInfiniteQuery,
} from "@/app/services/comments";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

type Props = {
  sequenceId: number;
  /** The sequence's owner may delete any comment on it. */
  sequenceOwnerId?: number;
  viewer?: { id?: string; name?: string | null; image?: string | null };
  /** Called with the live total whenever it changes (to update cards). */
  onCountChange?: (count: number) => void;
};

export function CommentSection({
  sequenceId,
  sequenceOwnerId,
  viewer,
  onCountChange,
}: Props) {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetCommentsInfiniteQuery(sequenceId);
  const [deleteComment] = useDeleteCommentMutation();

  const comments = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total;
  const viewerId = viewer?.id ? Number(viewer.id) : undefined;
  const isSequenceOwner = viewerId !== undefined && viewerId === sequenceOwnerId;

  useEffect(() => {
    if (total !== undefined) onCountChange?.(total);
    // Only a change of the count matters, not a new callback identity.
  }, [total]);

  const onDelete = async (id: number) => {
    await deleteComment({ id, sequenceId }).unwrap();
  };

  return (
    <section
      aria-labelledby="comments-heading"
      className="mt-6 border-t border-border pt-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        <Text id="comments-heading" size="3" weight="medium" as="div">
          {t("comments.title")}
        </Text>
        {total !== undefined && (
          <Text size="2" className="text-muted-foreground" data-testid="comment-total">
            {total}
          </Text>
        )}
      </div>

      <CommentForm sequenceId={sequenceId} viewer={viewer} />

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center gap-2 py-6">
          <Text size="2" className="text-muted-foreground">
            {t("comments.loadError")}
          </Text>
          <Button size="1" variant="soft" onClick={() => refetch()}>
            {t("comments.retry")}
          </Button>
        </div>
      ) : comments.length === 0 ? (
        <Text as="p" size="2" className="py-6 text-center text-muted-foreground">
          {t("comments.empty")}
        </Text>
      ) : (
        <>
          <ul className="mt-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canDelete={isSequenceOwner || comment.authorId === viewerId}
                onDelete={onDelete}
              />
            ))}
          </ul>
          {hasNextPage && (
            <div className="mt-3 flex justify-center">
              <Button
                size="1"
                variant="soft"
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {t("comments.loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
