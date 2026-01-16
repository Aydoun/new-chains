"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import {
  useGetSequenceByIdQuery,
  useUpdateSequenceMutation,
} from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { Modal } from "./ui/modal";
import { SequenceFrame } from "./sequence-card";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  DEFAULT_SEQUENCE_STATUS,
  SEQUENCE_STATUSES,
  SEQUENCE_STATUS_LABELS,
  SequenceStatus,
} from "@/lib/sequence-status";
import { SequenceStatusBadge } from "./sequence-status-badge";
import { Select, Text } from "@radix-ui/themes";

interface Props {
  sequenceId: string | number | null;
  onClose: () => void;
}

export function ViewSequence({ sequenceId, onClose }: Props) {
  const [activeFrame, setActiveFrame] = useState(0);
  const { data, isFetching, isError, refetch } = useGetSequenceByIdQuery(
    sequenceId ?? skipToken
  );
  const [updateSequence, { isLoading: isUpdatingStatus }] =
    useUpdateSequenceMutation();
  const guardedFrames = data?.frames ?? [];

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleStatusChange = async (status: SequenceStatus) => {
    if (!data?.id || status === (data.status ?? DEFAULT_SEQUENCE_STATUS))
      return;

    try {
      await updateSequence({ id: data.id, updates: { status } }).unwrap();
      await refetch();
    } catch (error) {
      console.error("Unable to update sequence status", error);
    }
  };

  if (!sequenceId) return null;

  return (
    <Modal open onOpenChange={handleDialogChange}>
      <Modal.Content className="border rounded-2xl bg-gray-900 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold text-white">
              {data?.title ?? ""}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <SequenceStatusBadge status={data?.status} />
              <Select.Root
                value={data?.status ?? DEFAULT_SEQUENCE_STATUS}
                onValueChange={(value) =>
                  handleStatusChange(value as SequenceStatus)
                }
                disabled={isUpdatingStatus}
              >
                <Select.Trigger
                  variant="soft"
                  color="orange"
                  aria-label="Status"
                  className="min-w-[140px]"
                >
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {SEQUENCE_STATUSES.map((status) => (
                    <Select.Item key={status} value={status}>
                      {SEQUENCE_STATUS_LABELS[status]}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {isUpdatingStatus && (
                <Text size="1" color="gray" aria-live="polite">
                  Saving status...
                </Text>
              )}
            </div>
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
