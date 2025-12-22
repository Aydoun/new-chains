import { useMemo, useState } from "react";
import { Collection } from "@/app/types";
import * as Dialog from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { Carousel } from "./ui/carousel";
import { Spinner } from "./ui/spinner";
import { useLazyGetSequenceByIdQuery } from "@/app/services/collections";
import { cn } from "@/lib/utils";

export interface CollectionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

export function CollectionCard({ collection }: { collection: Collection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const [fetchSequence, { data: sequence, isFetching, isError, error }] =
    useLazyGetSequenceByIdQuery();

  const PLACEHOLDER_IMAGE = "/image-placeholder.svg";
  const imageSource = collection.url || PLACEHOLDER_IMAGE;
  const frames = sequence?.frames ?? [];

  const orderedFrames = useMemo(() => frames, [frames]);

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchSequence(collection.id);
      setActiveFrame(0);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
      <Dialog.Trigger asChild>
        <button
          className="group flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4 text-left shadow-lg ring-1 ring-gray-800 transition hover:-translate-y-0.5 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          data-testid={`sequence-tile-${collection.id}`}
        >
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-900">
              <img
                src={imageSource}
                alt={`${collection.title} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {collection.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    #{collection.id}
                  </span>
                </div>
                <span className="rounded-full bg-gray-700 px-3 py-1 text-[11px] font-medium uppercase text-gray-200">
                  {collection.visibility.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-200">
                {collection.description || "No description provided."}
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
                {collection.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Drift through every frame in this sequence with a warm brew vibe.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Separator className="my-4 bg-gray-800" />
          <div className="flex flex-col gap-4 text-sm text-gray-100">
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#2b1a13] via-[#3c2417] to-[#2b1a13] p-3 text-amber-100 shadow-inner ring-1 ring-amber-900/40">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-800 ring-2 ring-amber-700/60">
                <img
                  src={imageSource}
                  alt={`${collection.title} avatar enlarged`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-amber-50">
                <span className="text-xs uppercase tracking-wide opacity-90">
                  Sequence #{collection.id}
                </span>
                <span className="text-xs font-semibold">
                  Visibility: {collection.visibility}
                </span>
              </div>
            </div>

            {isFetching && (
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1b100b] via-[#24130d] to-[#1b100b] p-8 text-amber-50 ring-1 ring-amber-900/40">
                <Spinner className="text-amber-200" />
              </div>
            )}

            {!isFetching && isError && (
              <div className="rounded-lg bg-red-900/40 p-4 text-sm text-red-200">
                {"status" in (error as Record<string, unknown>)
                  ? `Unable to load sequence (status ${
                      (error as { status?: number }).status
                    }).`
                  : "Unable to load sequence at this time."}
              </div>
            )}

            {!isFetching && !isError && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-amber-100">
                  <span className="font-semibold uppercase tracking-wide">
                    Frames
                  </span>
                  <span className="rounded-full bg-amber-900/40 px-3 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-amber-700/60">
                    {orderedFrames.length} items
                  </span>
                </div>
                <Carousel
                  frames={
                    orderedFrames.length > 0
                      ? orderedFrames.map((frame, index) => (
                          <SequenceFrame
                            key={frame?.id ?? index}
                            index={index}
                            text={frame?.content || "Empty frame"}
                            description={frame?.description || ""}
                          />
                        ))
                      : [
                          <SequenceFrame
                            key="empty"
                            index={0}
                            text="No frames added yet"
                            description="Add frames to see them flow in this carousel."
                          />,
                        ]
                  }
                  className="w-full"
                  currentIndex={activeFrame}
                  onNext={() =>
                    setActiveFrame((current) =>
                      Math.min(
                        current + 1,
                        Math.max(orderedFrames.length - 1, 0)
                      )
                    )
                  }
                  onPrevious={() =>
                    setActiveFrame((current) => Math.max(current - 1, 0))
                  }
                />
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface SequenceFrameProps {
  text: string;
  description?: string;
  index: number;
}

function SequenceFrame({ text, description, index }: SequenceFrameProps) {
  return (
    <div
      className={cn(
        "flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,#5b3a2a,#2b1810)] text-center text-amber-50 shadow-xl ring-1 ring-amber-900/40 backdrop-blur-sm",
        "bg-blend-overlay"
      )}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
        Frame {index + 1}
      </span>
      <p className="px-6 text-xl font-black leading-tight drop-shadow-sm">
        {text}
      </p>
      {description ? (
        <p className="px-8 text-sm font-medium text-amber-100/80">
          {description}
        </p>
      ) : null}
    </div>
  );
}
