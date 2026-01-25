import { translate } from "@/lib/i18n";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { EllipsisVertical } from "lucide-react";

interface Props {
  onView: () => void;
  onDelete: () => void;
}

export function SnippetMenu({ onView, onDelete }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" className="cursor-pointer">
          <EllipsisVertical className="text-black" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={onView}>
          {translate("snippets.menu.view")}
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete} color="red">
          {translate("snippets.menu.delete")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
