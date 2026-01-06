"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { useGetSequenceByIdQuery } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { Modal } from "./ui/modal";
import { SequenceFrame } from "./sequence-card";
import { skipToken } from "@reduxjs/toolkit/query";
import { Heading, Text } from "@radix-ui/themes";

interface Props {
  sequenceId: string | number | null;
  onClose: () => void;
}

export function ViewSequence({ sequenceId, onClose }: Props) {
  const [activeFrame, setActiveFrame] = useState(0);
  const { data, isFetching, isError } = useGetSequenceByIdQuery(
    sequenceId ?? skipToken
  );
  const guardedFrames = data?.frames ?? [];

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  if (!sequenceId) return null;

  return (
    <Modal open onOpenChange={handleDialogChange}>
      <Modal.Content className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 mb-4">
            <Heading as="h2" className="font-semibold">
              {data?.title ?? ""}
            </Heading>
          </div>
          <Modal.Close aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </Modal.Close>
        </div>
        {!isFetching && !isError && (
          <div className="flex flex-col gap-3">
            <div>
              <Text size="2">{translate("frame.selfs")}</Text>
              <Text
                size="2"
                className="ml-2 rounded-full bg-primary-main px-3 py-1 shadow-sm"
              >
                {data?.FrameOrder.length ?? 0} {translate("common.items")}
              </Text>
            </div>
            <Carousel
              frames={
                guardedFrames.length > 0
                  ? guardedFrames.map((frame, index) => (
                      <SequenceFrame
                        key={frame?.id ?? index}
                        text={frame?.content}
                        description={frame?.description}
                      />
                    ))
                  : [
                      <SequenceFrame
                        key="empty"
                        text={translate("frame.empty")}
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
                    Math.max(guardedFrames.length - 1, 0)
                  );
                })
              }
              onPrevious={() =>
                setActiveFrame((current) => Math.max(current - 1, 0))
              }
            />
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}
