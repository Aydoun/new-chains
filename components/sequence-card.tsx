import {
  FC,
  useState,
  MouseEvent as ReactMouseEvent,
  useMemo,
  useEffect,
} from "react";
import { Sequence } from "@/app/types";
import { Dialog } from "@radix-ui/themes";
import { Separator } from "@radix-ui/react-separator";
import { Trash2, X, Share2, Pencil, Loader2 } from "lucide-react";
import { translate } from "@/lib/i18n";
import {
  useDeleteSequenceMutation,
  useLazyGetSequenceByIdQuery,
  useUpdateSequenceMutation,
} from "@/app/services/sequences";
import { Carousel } from "./ui/carousel";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const [updateSequence, { isLoading: isUpdating }] =
    useUpdateSequenceMutation();
  const { data: session } = useSession();
  const isOwner = session?.user?.id === sequence.userId.toString();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(sequence.title);
  const [currentVisibility, setCurrentVisibility] = useState(
    sequence.visibility
  );
  const [currentDescription, setCurrentDescription] = useState(
    sequence.description ?? ""
  );
  const [editTitle, setEditTitle] = useState(sequence.title);
  const [editDescription, setEditDescription] = useState(
    sequence.description ?? ""
  );
  const [editVisibility, setEditVisibility] = useState(sequence.visibility);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");

  const PLACEHOLDER_IMAGE = "/image-placeholder.svg";
  const imageSource = sequence.url || PLACEHOLDER_IMAGE;
  const [fetchSequence, { data, isFetching, isError }] =
    useLazyGetSequenceByIdQuery();
  const guardedFrames = data?.frames ?? [];

  const authorHref = `/studio?user=${sequence.user?.id ?? sequence.userId}`;
  const authorLabel = sequence.user?.username ?? "Unknown author";
  const canonicalLink = useMemo(() => {
    if (sequence.url && sequence.url.startsWith("http")) {
      return sequence.url;
    }

    const basePath = `/studio?user=${sequence.user?.id ?? sequence.userId}`;
    const sharePath = `${basePath}&sequence=${sequence.id}`;

    if (typeof window !== "undefined") {
      return `${window.location.origin}${sharePath}`;
    }

    return sharePath;
  }, [sequence.id, sequence.url, sequence.user?.id, sequence.userId]);

  useEffect(() => {
    if (isEditOpen) {
      setEditTitle(currentTitle);
      setEditDescription(currentDescription);
      setEditVisibility(currentVisibility);
    }
  }, [isEditOpen, currentTitle, currentDescription, currentVisibility]);

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
    if (!isOwner) return;
    try {
      await deleteSequence(sequence.id).unwrap();
    } catch (error) {
      console.error("Unable to delete sequence right now.", error);
    }
  };

  const handleShareLink = async (
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentTitle,
          url: canonicalLink,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(canonicalLink);
      }
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch (error) {
      console.error("Unable to share sequence", error);
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  const handleEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!isOwner) return;

    try {
      await updateSequence({
        id: sequence.id,
        updates: {
          title: editTitle,
          description: editDescription,
          visibility: editVisibility,
        },
      }).unwrap();
      setCurrentTitle(editTitle);
      setCurrentVisibility(editVisibility);
      setCurrentDescription(editDescription);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Unable to update sequence", error);
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
                alt={`${currentTitle} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <Text weight="bold" className="text-white">
                    {currentTitle}
                  </Text>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      size="1"
                      variant="soft"
                      color="gray"
                      className="w-fit capitalize"
                    >
                      {currentVisibility.toLowerCase()}
                    </Badge>
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                      #{sequence.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                    <span className="text-gray-400">by</span>
                    <Link
                      href={authorHref}
                      onClick={(event) => event.stopPropagation()}
                      className="font-semibold text-blue-200 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
                    >
                      {authorLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
              <IconButton
                aria-label="Share sequence"
                size="1"
                variant="ghost"
                onClick={handleShareLink}
                className="text-blue-400 hover:bg-blue-600/15 focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Share2 className="h-4 w-4" />
              </IconButton>
              {isOwner && (
                <>
                  <IconButton
                    aria-label="Edit sequence"
                    size="1"
                    variant="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      setIsEditOpen(true);
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
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>Tap to preview</p>
            {shareStatus === "copied" && (
              <span className="text-green-400">Link copied</span>
            )}
            {shareStatus === "error" && (
              <span className="text-red-400">Share failed</span>
            )}
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[340px]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Dialog.Title className="text-xl font-semibold text-white">
              {currentTitle}
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
        {isFetching && (
          <div className="flex h-48 items-center justify-center text-sm text-gray-300 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading sequence...</span>
          </div>
        )}
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

    <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="flex items-start justify-between gap-4">
          <Dialog.Title className="text-xl font-semibold text-white">
            Edit sequence
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close edit dialog"
            className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
        </div>
        <Separator className="my-4 bg-gray-800" />
        <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="edit-title">
              Title
            </label>
            <TextField.Root
              id="edit-title"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-white"
              htmlFor="edit-description"
            >
              Description
            </label>
            <TextArea
              id="edit-description"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-white"
              htmlFor="edit-visibility"
            >
              Visibility
            </label>
            <select
              id="edit-visibility"
              value={editVisibility}
              onChange={(event) =>
                setEditVisibility(
                  event.target.value as Sequence["visibility"]
                )
              }
              className="h-10 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="FRIENDS_ONLY">Friends only</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="soft" color="gray" type="button">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
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
