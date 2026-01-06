import { TimeFilter } from "@/app/types";
import { translate } from "@/lib/i18n";
import { DropdownMenu, Separator, Text } from "@radix-ui/themes";
import { Filter } from "lucide-react";

type TimeFilterOption = {
  value: TimeFilter;
};

const FILTER_OPTIONS: TimeFilterOption[] = [
  { value: "last-hour" },
  { value: "today" },
  { value: "this-week" },
  { value: "this-month" },
];

function getLabelForFilter(value?: TimeFilter) {
  const translationKey = FILTER_OPTIONS.find(
    (option) => option.value === value
  )?.value;

  return translationKey ? translate(`filter.${translationKey}`) : "";
}

type Props = {
  value?: TimeFilter;
  onChange: (value: TimeFilter | undefined) => void;
};

export function FilterDropdown({ value, onChange }: Props) {
  const currentLabel = getLabelForFilter(value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary">
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
            onChange((selected ?? undefined) as TimeFilter)
          }
        >
          {FILTER_OPTIONS.map((option) => (
            <DropdownMenu.RadioItem
              key={option.value}
              value={option.value ?? ""}
            >
              {translate(`filter.${option.value}`)}
            </DropdownMenu.RadioItem>
          ))}
          <Separator className="w-full my-3" />
          <DropdownMenu.RadioItem key="clear" value="">
            Clear Filter
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
