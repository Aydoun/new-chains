import { FC, useState, MouseEvent as ReactMouseEvent } from "react";
import { Sequence } from "@/app/types";
import { Clock3, Pencil, Share2, Trash2, User } from "lucide-react";
import { translate } from "@/lib/i18n";
import { cn, timeAgo } from "@/lib/utils";
import { IconButton, Spinner, Text } from "@radix-ui/themes";
import Link from "next/link";
import { MarkdownRenderer } from "./ui/markdown-renderer";

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
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-[#1a2533]"
      >
        <div className="h-44 w-full overflow-hidden">
          <SequenceFrame
            text={sequence.firstFrame?.content}
            count={sequence.FrameOrder.length}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <Text
              size="4"
              weight="bold"
              className="line-clamp-2leading-snug text-white transition-colors group-hover:text-primary-main"
              as="div"
            >
              {sequence.title}
            </Text>
            <MarkdownRenderer
              content={sequence.description}
              className="line-clamp-3 text-[#92a9c9]"
            />
          </div>
          {!omitAuthor && (
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-1 hover:underline text-[#92a9c9]"
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
            <div className="flex items-center gap-1 text-[#92a9c9]">
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
                          "text-red-600 hover:bg-red-600/15 cursor-pointer"
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
}

interface FrameContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const SequenceFrame: FC<SequenceFrameProps> = ({
  text,
  description,
  count,
}) => {
  return (
    <FrameContainer>
      <div
        className={cn(
          "relative flex h-48 w-full flex-col items-center justify-center gap-2 text-amber-50"
        )}
      >
        <blockquote className="max-w-2xl text-center text-gray-800">
          <MarkdownRenderer
            content={text}
            className="font-serif text-center text-lg md:text-2xl leading-tight text-amber-50"
          />
        </blockquote>
        {description && (
          <MarkdownRenderer
            content={description}
            className="px-8 text-sm text-amber-700 font-medium text-center"
          />
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
      </div>
    </FrameContainer>
  );
};

export function FrameContainer({ className, children }: FrameContainerProps) {
  return (
    <div
      className={cn(
        "flex h-48 w-full items-center justify-center bg-frame-primary font-[400] rounded-md",
        className
      )}
    >
      {children}
    </div>
  );
}
