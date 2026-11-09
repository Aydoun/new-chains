"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button, Text, TextArea } from "@radix-ui/themes";
import { useTranslation } from "@/components/locale-provider";
import { useCreateCommentMutation } from "@/app/services/comments";
import { UserAvatar } from "@/components/ui/user-avatar";
import { COMMENT_MAX_LENGTH } from "@/lib/constants";
import { characterCount } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Props = {
  sequenceId: number;
  viewer?: { id?: string; name?: string | null; image?: string | null };
};

export function CommentForm({ sequenceId, viewer }: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const length = characterCount(content.trim());
  const tooLong = length > COMMENT_MAX_LENGTH;
  const canPost = length > 0 && !tooLong && !isLoading;

  const submit = async () => {
    if (!canPost) return;
    setError(null);
    try {
      await createComment({ sequenceId, content: content.trim() }).unwrap();
      setContent("");
    } catch {
      setError(t("comments.postError"));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  // Cmd/Ctrl + Enter posts; plain Enter makes a new line.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-3">
      <UserAvatar name={viewer?.name} src={viewer?.image} seed={viewer?.id} />
      <div className="flex-1 space-y-2">
        <TextArea
          aria-label={t("comments.label")}
          placeholder={t("comments.placeholder")}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={onKeyDown}
          rows={2}
          radius="large"
        />
        {error && (
          <Text as="p" size="1" color="red" role="alert">
            {error}
          </Text>
        )}
        <div className="flex items-center justify-between">
          <Text
            size="1"
            data-testid="comment-counter"
            className={cn("text-muted-foreground", tooLong && "text-red-600")}
          >
            {length} / {COMMENT_MAX_LENGTH}
          </Text>
          <Button type="submit" size="1" disabled={!canPost} loading={isLoading}>
            {t("comments.post")}
          </Button>
        </div>
      </div>
    </form>
  );
}
