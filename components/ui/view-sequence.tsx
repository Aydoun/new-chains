"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { useGetSequenceByIdQuery } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { Modal } from "./modal";
import { SequenceFrame } from "../sequence-card";
import { skipToken } from "@reduxjs/toolkit/query";

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
      <Modal.Content className="rounded-1xl bg-gray-900 p-8 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold text-white">
              {data?.title ?? ""}
            </h2>
          </div>
          <Modal.Close aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </Modal.Close>
        </div>
        {!isFetching && !isError && (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-amber-100">
              <span className="font-semibold uppercase tracking-wide">
                {translate("frame.selfs")}
              </span>
              <span className="ml-2 rounded-full bg-primary-main px-3 py-1 font-semibold shadow-sm ring-1 ring-amber-700/60">
                {data?.FrameOrder.length ?? 0} {translate("common.items")}
              </span>
            </div>
            <Carousel
              frames={
                guardedFrames.length > 0
                  ? guardedFrames.map((frame, index) => (
                      <SequenceFrame
                        key={frame?.id ?? index}
                        text={frame?.content || "Empty frame"}
                        description={frame?.description || ""}
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
