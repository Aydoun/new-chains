import { SequenceTimeFilter } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { Filter } from "lucide-react";

type TimeFilterOption = {
  value: SequenceTimeFilter;
};

const FILTER_OPTIONS: TimeFilterOption[] = [
  { value: "last-hour" },
  { value: "today" },
  { value: "this-week" },
  { value: "this-month" },
];

function isSequenceTimeFilter(value: string): value is SequenceTimeFilter {
  return FILTER_OPTIONS.some((option) => option.value === value);
}

function getLabelForFilter(value?: SequenceTimeFilter) {
  const translationKey = FILTER_OPTIONS.find(
    (option) => option.value === value
  )?.value;

  return translationKey ? translate(`filter.${translationKey}`) : "";
}

type Props = {
  value?: SequenceTimeFilter;
  onChange: (value: SequenceTimeFilter | undefined) => void;
};

export function FilterDropdown({ value, onChange }: Props) {
  const currentLabel = getLabelForFilter(value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="flex items-center gap-2 outline-none rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
          <Filter className="h-5 w-5" aria-hidden="true" />
          <Text size="2" weight="medium" className="hidden sm:inline">
            {currentLabel
              ? `Filter: ${currentLabel}`
              : translate("common.filter")}
          </Text>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" color="indigo">
        <DropdownMenu.Label>{translate("filter.label")}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={value ?? ""}
          onValueChange={(selected) =>
            onChange(isSequenceTimeFilter(selected) ? selected : undefined)
          }
        >
          {FILTER_OPTIONS.map((option) => (
            <DropdownMenu.RadioItem key={option.value} value={option.value}>
              {translate(`filter.${option.value}`)}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
