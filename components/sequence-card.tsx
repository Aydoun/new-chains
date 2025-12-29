import { FC, useState, MouseEvent as ReactMouseEvent } from "react";
import { Sequence } from "@/app/types";
import { Clock3, Pencil, Share2, Trash2, User } from "lucide-react";
import { translate } from "@/lib/i18n";
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
  onClick: () => void;
  handleDelete?: (sequenceId: string | number) => void;
  omitAuthor?: boolean;
}

export const SequenceCard: FC<Props> = ({
  sequence,
  userId,
  onClick,
  handleDelete,
  omitAuthor = false,
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
      <div className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#233348] bg-[#1a2533] transition-all duration-300 hover:border-[#136dec]/50 hover:shadow-xl hover:shadow-black/20">
        <div onClick={onClick} className="h-44 w-full overflow-hidden">
          <SequenceFrame
            text={sequence.firstFrame?.content}
            count={sequence.FrameOrder.length}
          />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div onClick={onClick} className="space-y-1">
            <Text
              size="4"
              weight="bold"
              className="leading-snug text-white transition-colors group-hover:text-primary-main"
              as="div"
            >
              {sequence.title}
            </Text>
            <Text size="2" className="text-[#92a9c9]">
              {sequence.description}
            </Text>
          </div>
          {!omitAuthor && (
            <div className="flex items-center gap-1 hover:underline text-[#92a9c9]">
              <User className="h-4 w-4" aria-hidden="true" />
              <Link href={`/explore/${sequence.userId}`}>
                {sequence.user?.username}
              </Link>
            </div>
          )}
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
                    }}
                    className="text-amber-300 hover:bg-amber-500/15 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    aria-label="Delete sequence"
                    size="1"
                    variant="ghost"
                    onClick={onDelete}
                    className={cn(
                      "text-red-600 hover:bg-red-600/15 focus-visible:ring-2 focus-visible:ring-red-600"
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
                  <Text size="1">{translate("sequence.cta.url-copied")}</Text>
                ) : (
                  <Share2 className="text-primary-main h-4 w-4" />
                )}
              </IconButton>
            </div>
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
          <p className="font-serif text-1xl md:text-2xl leading-tight">
            {text}
          </p>
        </blockquote>
        {description && (
          <p className="px-8 text-sm font-medium text-zinc-800">
            {description}
          </p>
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
