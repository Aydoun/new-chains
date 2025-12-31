import { SequenceTimeFilter } from "@/app/services/sequences";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { Filter } from "lucide-react";

type TimeFilterOption = {
  value: SequenceTimeFilter;
  label: string;
};

const FILTER_OPTIONS: TimeFilterOption[] = [
  { value: "last-hour", label: "Last hour" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
];

function isSequenceTimeFilter(value: string): value is SequenceTimeFilter {
  return FILTER_OPTIONS.some((option) => option.value === value);
}

function getLabelForFilter(value?: SequenceTimeFilter) {
  return FILTER_OPTIONS.find((option) => option.value === value)?.label ?? null;
}

type Props = {
  value?: SequenceTimeFilter;
  onChange: (value: SequenceTimeFilter | undefined) => void;
};

export function TimeFilterDropdown({ value, onChange }: Props) {
  const currentLabel = getLabelForFilter(value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
          <Filter className="h-5 w-5" aria-hidden="true" />
          <Text size="2" weight="medium" className="hidden sm:inline">
            {currentLabel ? `Filter: ${currentLabel}` : "Filter"}
          </Text>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" color="indigo">
        <DropdownMenu.Label>Created</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={value ?? ""}
          onValueChange={(selected) =>
            onChange(isSequenceTimeFilter(selected) ? selected : undefined)
          }
        >
          {FILTER_OPTIONS.map((option) => (
            <DropdownMenu.RadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
