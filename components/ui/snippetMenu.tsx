import { useTranslation } from "@/components/locale-provider";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { EllipsisVertical } from "lucide-react";

interface Props {
  onView: () => void;
  onDelete: () => void;
}

export function SnippetMenu({ onView, onDelete }: Props) {
  const { t } = useTranslation();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          className="cursor-pointer"
          aria-label={t("snippets.menu.label")}
        >
          <EllipsisVertical className="text-black" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={onView}>
          {t("snippets.menu.view")}
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete} color="red">
          {t("snippets.menu.delete")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
