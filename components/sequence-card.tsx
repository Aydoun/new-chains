import { FC, useState, MouseEvent as ReactMouseEvent } from "react";
import { Sequence } from "@/app/types";
import { Clock3, Heart, Pencil, Share2, Trash2, User } from "lucide-react";
import { translate } from "@/lib/i18n";
import { cn, timeAgo } from "@/lib/utils";
import { IconButton, Spinner, Text } from "@radix-ui/themes";
import Link from "next/link";
import clsx from "clsx";

export interface SequenceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

interface Props {
  sequence: Sequence;
  userId: string | undefined;
  onClick: () => void;
  deletingSequenceRef?: string | number;
  handleDelete?: (sequenceId: string | number) => void;
  omitAuthor?: boolean;
}

export const SequenceCard: FC<Props> = ({
  sequence,
  userId,
  onClick,
  handleDelete,
  omitAuthor = false,
  deletingSequenceRef,
}) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const isOwner = userId === `${sequence.userId}`;

  const onDelete = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (handleDelete) handleDelete(sequence.id);
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
    <>
      <div
        onClick={onClick}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border border-t-0"
      >
        <div className="h-44 w-full overflow-hidden">
          <SequenceFrame
            text={sequence.firstFrame?.content}
            count={sequence.FrameOrder.length}
            showIsLiked={false}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <Text
              size="4"
              weight="bold"
              className="line-clamp-2 leading-snug text-foreground transition-colors group-hover:text-primary-main"
              as="div"
            >
              {sequence.title}
            </Text>
            <Text size="2" className="line-clamp-3 text-muted-foreground">
              {sequence.description}
            </Text>
          </div>
          {!omitAuthor && (
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-1 text-muted-foreground hover:underline"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <Link href={`/explore/${sequence.userId}`}>
                {sequence.user?.username}
              </Link>
            </div>
          )}
          <div
            data-testid="card-menu"
            className="mt-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              <Text size="1" weight="medium">
                {timeAgo(sequence.createdAt)}
              </Text>
            </div>
            {deletingSequenceRef === sequence.id ? (
              <Spinner />
            ) : (
              <>
                <div
                  data-testid="sequence-menu"
                  className="flex items-center gap-2"
                >
                  {isOwner && (
                    <>
                      <IconButton
                        aria-label="Edit sequence"
                        size="1"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                        className="text-amber-600 hover:bg-amber-500/15 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        aria-label="Delete sequence"
                        size="1"
                        variant="ghost"
                        onClick={onDelete}
                        className={cn(
                          "text-red-600 hover:bg-red-600/15 cursor-pointer",
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
                    className="cursor-pointer"
                  >
                    {isLinkCopied ? (
                      <Text size="1">
                        {translate("sequence.cta.url-copied")}
                      </Text>
                    ) : (
                      <Share2 className="text-primary-main h-4 w-4" />
                    )}
                  </IconButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface SequenceFrameProps {
  text: string | undefined;
  description?: string | undefined | null;
  count?: number;
  liked?: boolean;
  showIsLiked?: boolean;
  onLike?: () => void;
}

export const SequenceFrame: FC<SequenceFrameProps> = ({
  text,
  description,
  count,
  liked,
  showIsLiked = true,
  onLike,
}) => {
  return (
    <div
      className={cn(
        "relative flex h-48 w-full flex-col items-center justify-center gap-2 bg-frame-primary rounded-lg",
      )}
    >
      <blockquote className="max-w-2xl text-center text-gray-800">
        <p className="font-serif text-1xl md:text-2xl leading-tight">{text}</p>
      </blockquote>
      {description && (
        <p className="px-8 text-sm text-amber-700 font-medium">{description}</p>
      )}
      {count && (
        <div className="absolute top-3 right-3 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white border border-white/10">
            {translate("sequence.countLabel", {
              count: count ?? 0,
            })}
          </span>
        </div>
      )}
      {showIsLiked && (
        <Heart
          fill={liked ? "red" : "none"}
          className={clsx("w-5 h-5 absolute top-4 right-4 cursor-pointer", {
            "text-primary-main": !liked,
          })}
          onClick={onLike}
        />
      )}
    </div>
  );
};
