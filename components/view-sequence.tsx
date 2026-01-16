"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { useGetSequenceByIdQuery } from "@/app/services/sequences";
import { useSaveSnippetMutation } from "@/app/services/snippets";
import { translate } from "@/lib/i18n";
import { Modal } from "./ui/modal";
import { SequenceFrame } from "./sequence-card";
import { skipToken } from "@reduxjs/toolkit/query";
import { FrameType } from "@/app/types";
import { useSession } from "next-auth/react";
import { Badge, Button, Text, TextArea } from "@radix-ui/themes";

const FRAME_TYPES: FrameType[] = [
  "PHRASE",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
];

interface Props {
  sequenceId: string | number | null;
  onClose: () => void;
}

export function ViewSequence({ sequenceId, onClose }: Props) {
  const { data: session } = useSession();
  const [saveSnippet, { isLoading: isSavingSnippet }] =
    useSaveSnippetMutation();
  const [activeFrame, setActiveFrame] = useState(0);
  const [snippetNotes, setSnippetNotes] = useState("");
  const [snippetType, setSnippetType] = useState<FrameType>("PHRASE");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const { data, isFetching, isError } = useGetSequenceByIdQuery(
    sequenceId ?? skipToken
  );
  const guardedFrames = data?.frames ?? [];

  useEffect(() => {
    const currentType = guardedFrames[activeFrame]?.type as
      | FrameType
      | undefined;
    if (currentType) {
      setSnippetType(currentType);
    }
    setSaveStatus("idle");
  }, [activeFrame, guardedFrames]);

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSaveSnippet = async () => {
    const currentFrame = guardedFrames[activeFrame];
    const parsedSequenceId = Number(sequenceId);

    if (!currentFrame || Number.isNaN(parsedSequenceId)) return;
    if (!session?.user?.id) {
      setSaveStatus("error");
      return;
    }

    try {
      await saveSnippet({
        frameId: currentFrame.id,
        originSequenceId: parsedSequenceId,
        type: snippetType,
        notes: snippetNotes.trim() || undefined,
      }).unwrap();
      setSaveStatus("saved");
      setSnippetNotes("");
    } catch {
      setSaveStatus("error");
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
            {session?.user?.id && guardedFrames.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2 justify-between">
                  <Text weight="bold" className="text-white">
                    {translate("snippets.saveTitle")}
                  </Text>
                  {saveStatus === "saved" && (
                    <Badge color="green" radius="full">
                      {translate("snippets.status.saved")}
                    </Badge>
                  )}
                  {saveStatus === "error" && (
                    <Badge color="red" radius="full">
                      {translate("snippets.status.error")}
                    </Badge>
                  )}
                </div>
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-wide text-gray-300">
                    {translate("snippets.typeLabel")}
                  </label>
                  <select
                    value={snippetType}
                    onChange={(event) =>
                      setSnippetType(event.target.value as FrameType)
                    }
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    {FRAME_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-wide text-gray-300">
                    {translate("snippets.notesInput")}
                  </label>
                  <TextArea
                    value={snippetNotes}
                    onChange={(event) => setSnippetNotes(event.target.value)}
                    radius="large"
                    placeholder={translate("snippets.notesPlaceholder")}
                  />
                </div>
                <Button
                  className="cursor-pointer"
                  onClick={handleSaveSnippet}
                  loading={isSavingSnippet}
                  disabled={!session?.user?.id}
                >
                  {translate("snippets.saveAction")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}
