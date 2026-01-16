import { Badge } from "@radix-ui/themes";
import {
  DEFAULT_SEQUENCE_STATUS,
  SEQUENCE_STATUS_LABELS,
  SEQUENCE_STATUS_STYLES,
  SequenceStatus,
} from "@/lib/sequence-status";
import { cn } from "@/lib/utils";

type Props = {
  status?: SequenceStatus | null;
  className?: string;
};

export function SequenceStatusBadge({ status, className }: Props) {
  const normalized = status ?? DEFAULT_SEQUENCE_STATUS;
  const { badge, dot } = SEQUENCE_STATUS_STYLES[normalized];

  return (
    <Badge
      variant="surface"
      radius="full"
      className={cn(
        "gap-2 border text-xs font-semibold uppercase tracking-wide",
        badge,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden="true" />
      {SEQUENCE_STATUS_LABELS[normalized]}
    </Badge>
  );
}
