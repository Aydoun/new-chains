"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, IconButton, Text } from "@radix-ui/themes";
import type { SequenceComment } from "@/app/types";
import { useTranslation } from "@/components/locale-provider";
import { UserAvatar } from "@/components/ui/user-avatar";
import { timeAgo } from "@/lib/utils";

type Props = {
  comment: SequenceComment;
  canDelete: boolean;
  onDelete: (id: number) => Promise<void>;
};

export function CommentItem({ comment, canDelete, onDelete }: Props) {
  const { t, locale } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { author } = comment;

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <li
      data-testid="comment"
      className="flex gap-3 border-b border-border py-3 last:border-b-0"
    >
      <UserAvatar name={author.username} src={author.avatarUrl} seed={author.id} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Text size="2" weight="medium" className="truncate">
            {author.username || t("comments.unknownUser")}
          </Text>
          <Text
            size="1"
            className="shrink-0 text-muted-foreground"
            title={new Date(comment.createdAt).toLocaleString(locale)}
          >
            <time dateTime={comment.createdAt}>
              {timeAgo(comment.createdAt, { locale })}
            </time>
          </Text>
          {canDelete && !confirming && (
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              className="ml-auto"
              aria-label={t("comments.delete")}
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </IconButton>
          )}
        </div>
        <Text as="p" size="2" className="mt-0.5 whitespace-pre-wrap break-words">
          {comment.content}
        </Text>
        {confirming && (
          <div className="mt-2 flex items-center gap-2">
            <Text size="1" className="text-muted-foreground">
              {t("comments.confirmDelete")}
            </Text>
            <Button size="1" color="red" loading={deleting} onClick={confirmDelete}>
              {t("comments.delete")}
            </Button>
            <Button
              size="1"
              variant="soft"
              color="gray"
              onClick={() => setConfirming(false)}
            >
              {t("comments.cancel")}
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
