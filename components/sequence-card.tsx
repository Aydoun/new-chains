import { FC, useState } from "react";
import { Sequence } from "@/app/types";
import * as Dialog from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { translate } from "@/lib/i18n";
import { useLazyGetSequenceByIdQuery } from "@/app/services/sequences";
import { Carousel } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Spinner } from "@radix-ui/themes";

export interface SequenceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

export function SequenceCard({ sequence }: { sequence: Sequence }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);

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

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogChange}>
      <Dialog.Trigger asChild>
        <button className="group flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4 text-left shadow-lg">
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-900">
              <img
                src={imageSource}
                alt={`${sequence.title} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {sequence.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    #{sequence.id}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-200">
                {sequence.description || "No description provided."}
              </p>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <p className="text-xs text-muted-foreground">Tap to preview</p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold text-white">
                {sequence.title}
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Separator className="my-4 bg-gray-800" />
          {!isFetching && !isError && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-amber-100">
                <span className="font-semibold uppercase tracking-wide">
                  {translate("frame.selfs")}
                </span>
                <span className="rounded-full bg-amber-900/40 px-3 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-amber-700/60">
                  {data?.FrameOrder.length} {translate("common.items")}
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
                  setActiveFrame((current) =>
                    Math.min(current + 1, Math.max(guardedFrames.length - 1, 0))
                  )
                }
                onPrevious={() =>
                  setActiveFrame((current) => Math.max(current - 1, 0))
                }
              />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

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
