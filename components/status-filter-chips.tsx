import {
  SEQUENCE_STATUSES,
  SEQUENCE_STATUS_LABELS,
  SEQUENCE_STATUS_STYLES,
  SequenceStatus,
} from "@/lib/sequence-status";
import { cn } from "@/lib/utils";

type Props = {
  value: SequenceStatus[];
  onChange: (value: SequenceStatus[]) => void;
  className?: string;
};

export function StatusFilterChips({ value, onChange, className }: Props) {
  const handleToggle = (status: SequenceStatus) => {
    if (value.includes(status)) {
      onChange(value.filter((item) => item !== status));
      return;
    }

    onChange([...value, status]);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {SEQUENCE_STATUSES.map((status) => {
        const isActive = value.includes(status);
        const { badge } = SEQUENCE_STATUS_STYLES[status];

        return (
          <button
            key={status}
            type="button"
            onClick={() => handleToggle(status)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
              badge,
              isActive
                ? "ring-2 ring-offset-0 ring-primary-main shadow-lg"
                : "opacity-80 hover:opacity-100"
            )}
            aria-pressed={isActive}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                SEQUENCE_STATUS_STYLES[status].dot
              )}
              aria-hidden="true"
            />
            {SEQUENCE_STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}
