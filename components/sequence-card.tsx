import { FC, useState, MouseEvent as ReactMouseEvent } from "react";
import { Sequence } from "@/app/types";
import { Dialog } from "@radix-ui/themes";
import { Separator } from "@radix-ui/react-separator";
import { Clock3, Pencil, Share2, Trash2, User, X } from "lucide-react";
import { translate } from "@/lib/i18n";
import {
  useDeleteSequenceMutation,
  useLazyGetSequenceByIdQuery,
} from "@/app/services/sequences";
import { Carousel } from "./ui/carousel";
import { cn, timeAgo } from "@/lib/utils";
import { IconButton, Text } from "@radix-ui/themes";
import Link from "next/link";

export interface SequenceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

interface Props {
  sequence: Sequence;
  userId: string | undefined;
  openDialog?: boolean;
}

export const SequenceCard: FC<Props> = ({
  sequence,
  userId,
  openDialog = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(openDialog);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [deleteSequence, { isLoading: isDeleting }] =
    useDeleteSequenceMutation();

  const [fetchSequence, { data, isFetching, isError }] =
    useLazyGetSequenceByIdQuery();
  const guardedFrames = data?.frames ?? [];
  const isOwner = userId === `${sequence.userId}`;

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

  const handleShareLink = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (isLinkCopied) return;

    const canonicalLink = `${window.location.origin}/?sequence=${sequence.id}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(canonicalLink);
      }
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (error) {
      console.error("Unable to share sequence", error);
    }
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogChange}>
      <Dialog.Trigger>
        <div className="">
          <div>
            <article
              key={sequence.title}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#233348] bg-[#1a2533] transition-all duration-300 hover:border-[#136dec]/50 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="h-44 w-full overflow-hidden">
                <SequenceFrame text={sequence.firstFrame?.content} />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="space-y-1">
                  <Text
                    size="4"
                    weight="bold"
                    className="leading-snug text-white transition-colors group-hover:text-[#f87171]"
                    as="div"
                  >
                    {sequence.title}
                  </Text>
                  <Text size="2" className="text-[#92a9c9]">
                    {sequence.description}
                  </Text>
                </div>
                <div className="flex items-center gap-1 hover:underline text-[#92a9c9]">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <Link href="/">Visit The Author</Link>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-[#233348] pt-2">
                  <div className="flex items-center gap-1 text-[#92a9c9]">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    <Text size="1" weight="medium">
                      {timeAgo(sequence.createdAt)}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <>
                        <IconButton
                          aria-label="Edit sequence"
                          size="1"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            // setIsEditOpen(true);
                            setIsDialogOpen(false);
                          }}
                          className="text-amber-300 hover:bg-amber-500/15 focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          aria-label="Delete sequence"
                          size="1"
                          variant="ghost"
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className={cn(
                            "text-red-600 hover:bg-red-600/15 focus-visible:ring-2 focus-visible:ring-red-600",
                            isDeleting && "opacity-60"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      aria-label="Share sequence"
                      size="1"
                      variant="ghost"
                      onClick={handleShareLink}
                    >
                      {isLinkCopied ? (
                        <Text size="1">
                          {translate("sequence.cta.url-copied")}
                        </Text>
                      ) : (
                        <Share2 className="text-blue-400 h-4 w-4" />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </Dialog.Trigger>
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

interface SequenceFrameProps {
  text: string | undefined;
  description?: string | undefined | null;
}

export const SequenceFrame: FC<SequenceFrameProps> = ({
  text,
  description,
}) => {
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
