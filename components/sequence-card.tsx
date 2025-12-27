import { FC, useState, MouseEvent as ReactMouseEvent } from "react";
import { Sequence } from "@/app/types";
import { Dialog } from "@radix-ui/themes";
import { Separator } from "@radix-ui/react-separator";
import { Trash2, X } from "lucide-react";
import { translate } from "@/lib/i18n";
import {
  useDeleteSequenceMutation,
  useLazyGetSequenceByIdQuery,
} from "@/app/services/sequences";
import { Carousel } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Badge, IconButton, Text } from "@radix-ui/themes";

export interface SequenceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

interface Props {
  sequence: Sequence;
}

export const SequenceCard: FC<Props> = ({ sequence }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const [deleteSequence, { isLoading: isDeleting }] =
    useDeleteSequenceMutation();

  const PLACEHOLDER_IMAGE = "/image-placeholder.svg";
  const imageSource = sequence.url || PLACEHOLDER_IMAGE;
  const [fetchSequence, { data, isFetching, isError }] =
    useLazyGetSequenceByIdQuery();
  const guardedFrames = data?.frames ?? [];

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      fetchSequence(sequence.id);
      setActiveFrame(0);
    }
  };

  const handleDelete = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      await deleteSequence(sequence.id).unwrap();
    } catch (error) {
      console.error("Unable to delete sequence right now.", error);
    }
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogChange}>
      <Dialog.Trigger>
        <div className="group flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4 text-left shadow-lg hover:shadow-xl cursor-pointer">
          <div className="flex items-start gap-3 relative">
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-900">
              <img
                src={imageSource}
                alt={`${sequence.title} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <Text weight="bold" className="text-white">
                    {sequence.title}
                  </Text>
                  <Badge size="1" variant="soft" color="gray" className="w-fit">
                    {sequence.visibility}
                  </Badge>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    #{sequence.id}
                  </span>
                </div>
              </div>
            </div>
            <IconButton
              aria-label="Delete sequence"
              size="1"
              variant="ghost"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(
                "absolute right-3 top-3 z-10 text-red-600 hover:bg-red-600/15 focus-visible:ring-2 focus-visible:ring-red-600",
                isDeleting && "opacity-60"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
          <Separator className="bg-gray-700" />
          <p className="text-xs text-muted-foreground">Tap to preview</p>
        </div>
      </Dialog.Trigger>
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[96vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-black p-8 shadow-2xl ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-2xl font-semibold text-white">
                {sequence.title}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                {translate("frame.selfs")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-full bg-gray-800/80 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          {!isFetching && !isError && (() => {
            const frameCount = guardedFrames.length;
            const currentFrame =
              frameCount > 0
                ? guardedFrames[Math.min(activeFrame, frameCount - 1)]
                : undefined;
            const safeCount = frameCount || 1;

            return (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                      {translate("frame.selfs")}
                    </span>
                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-[11px] font-semibold text-orange-100 shadow-sm ring-1 ring-orange-400/30">
                      {data?.FrameOrder.length ?? 0} {translate("common.items")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <span className="text-base leading-none">+</span>
                    Add Frame
                  </button>
                </div>

                <div className="relative w-full min-h-[320px] md:min-h-[380px] overflow-hidden rounded-2xl border border-orange-500/15 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 shadow-inner">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 h-20 w-20 bg-gradient-to-br from-orange-400/10 to-transparent" />
                    <div className="absolute bottom-0 right-0 h-20 w-20 bg-gradient-to-tl from-orange-400/10 to-transparent" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 hover:bg-black/5" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                    <blockquote className="text-3xl font-serif leading-tight text-amber-50">
                      {currentFrame?.content || translate("frame.empty")}
                    </blockquote>
                    {currentFrame?.description && (
                      <p className="max-w-2xl text-sm text-amber-100/80">
                        {currentFrame.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 text-white backdrop-blur">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFrame((current) => {
                        if (frameCount === 0) return 0;
                        return Math.max(current - 1, 0);
                      })
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900/60 text-gray-200 transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={translate("common.previous")}
                  >
                    <span className="text-lg font-bold">←</span>
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-gray-100">
                      {translate("frame.self")}{" "}
                      {Math.min(activeFrame + 1, safeCount)} of {safeCount}
                    </span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: safeCount }).map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition",
                            index === Math.min(activeFrame, safeCount - 1)
                              ? "bg-orange-400"
                              : "bg-gray-600"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFrame((current) => {
                        if (frameCount === 0) return 0;
                        if (current >= frameCount - 1) return 0;
                        return current + 1;
                      })
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900/60 text-gray-200 transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={translate("common.next")}
                  >
                    <span className="text-lg font-bold">→</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

interface SequenceFrameProps {
  text: string;
  description?: string;
}

const SequenceFrame: FC<SequenceFrameProps> = ({ text, description }) => {
  return (
    <div
      className={cn(
        "flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,#5b3a2a,#2b1810)] text-center text-amber-50 shadow-xl ring-1 ring-amber-900/40 backdrop-blur-sm",
        "bg-blend-overlay"
      )}
    >
      <p className="px-6 text-xl font-black leading-tight drop-shadow-sm">
        {text}
      </p>
      {description && (
        <p className="px-8 text-sm font-medium text-amber-100/80">
          {description}
        </p>
      )}
    </div>
  );
};
