"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { useGetSequenceByIdQuery } from "@/app/services/sequences";
import { useSaveSnippetMutation } from "@/app/services/snippets";
import { useTranslation } from "@/components/locale-provider";
import { Modal } from "./ui/modal";
import { SequenceFrame } from "./sequence-card";
import { ImageFrame } from "./image-frame";
import { skipToken } from "@reduxjs/toolkit/query";
import { Heading } from "@radix-ui/themes";
import { FrameSkeleton } from "./sequence-skeleton";
import { CommentSection } from "./comments/comment-section";
import { useSession } from "next-auth/react";

interface Props {
  sequenceId: string | number | null;
  onClose: () => void;
  /** Reports the sequence's comment count so the list can update its card. */
  onCommentCountChange?: (sequenceId: number, count: number) => void;
}

export function ViewSequence({
  sequenceId,
  onClose,
  onCommentCountChange,
}: Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [saveSnippet] = useSaveSnippetMutation();
  const [activeFrame, setActiveFrame] = useState(0);
  const [newLikes, setNewLikes] = useState<number[]>([]);

  const { data, isFetching, isError } = useGetSequenceByIdQuery(
    sequenceId ?? skipToken,
  );
  const guardedFrames = data?.frames ?? [];

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSaveSnippet = (frameId: number) => async () => {
    const currentFrame = guardedFrames.find((fr) => fr.id === frameId);
    const parsedSequenceId = Number(sequenceId);

    if (!currentFrame || Number.isNaN(parsedSequenceId)) return;

    try {
      setNewLikes((prev) => [...prev, frameId]);
      await saveSnippet({
        frameId: currentFrame.id,
        originSequenceId: parsedSequenceId,
      }).unwrap();
    } catch {
      console.error("error saving snipet!");
    }
  };

  if (!sequenceId) return null;

  return (
    <Modal open onOpenChange={handleDialogChange}>
      <Modal.Content className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 mb-4 w-full">
            {isFetching ? (
              <FrameSkeleton />
            ) : (
              <Heading as="h2" className="font-semibold">
                {data?.title ?? ""}
              </Heading>
            )}
          </div>
          <Modal.Close aria-label={t("common.close")} onClick={onClose}>
            <X className="h-4 w-4" />
          </Modal.Close>
        </div>
        {!isFetching && !isError && (
          <Carousel
            frames={
              guardedFrames.length > 0
                ? guardedFrames.map((frame) => {
                    const frameProps = {
                      text: frame.content,
                      description: frame.description,
                      onLike: handleSaveSnippet(frame.id),
                      liked:
                        data?.likedFrames.includes(frame.id) ||
                        newLikes.includes(frame.id),
                    };
                    // The media type decides how the frame is drawn.
                    return frame.type === "IMAGE" && frame.asset ? (
                      <ImageFrame
                        key={frame.id}
                        asset={frame.asset}
                        {...frameProps}
                      />
                    ) : (
                      <SequenceFrame key={frame.id} {...frameProps} />
                    );
                  })
                : [
                    <SequenceFrame
                      key="empty"
                      text={t("frame.empty")}
                      showIsLiked={false}
                    />,
                  ]
            }
            className="w-full"
            currentIndex={activeFrame}
            onNext={() =>
              setActiveFrame((current) => {
                if (current === guardedFrames.length - 1) return 0;

                return Math.min(
                  current + 1,
                  Math.max(guardedFrames.length - 1, 0),
                );
              })
            }
            onPrevious={() =>
              setActiveFrame((current) => Math.max(current - 1, 0))
            }
          />
        )}
        {!isError && data && (
          <CommentSection
            sequenceId={data.id}
            sequenceOwnerId={data.userId}
            viewer={session?.user}
            onCountChange={(count) => onCommentCountChange?.(data.id, count)}
          />
        )}
      </Modal.Content>
    </Modal>
  );
}
