import { Snippet } from "@/app/types";
import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge, Button, Separator, Spinner, Text } from "@radix-ui/themes";
import { BookOpenText, ExternalLink, FilePlus2, NotebookText } from "lucide-react";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  snippets?: Snippet[];
  isLoading?: boolean;
  onClose: () => void;
  onInsert: (snippet: Snippet) => void;
};

export function SnippetDrawer({
  isOpen,
  snippets = [],
  isLoading = false,
  onClose,
  onInsert,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition-all",
        isOpen ? "max-h-[720px]" : "max-h-16 overflow-hidden"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <NotebookText className="h-4 w-4 text-amber-300" />
          <div className="flex flex-col">
            <Text weight="bold">{translate("snippets.drawer.title")}</Text>
            <Text size="1" color="gray">
              {translate("snippets.drawer.subtitle")}
            </Text>
          </div>
        </div>
        <Button
          size="2"
          variant="soft"
          radius="full"
          onClick={onClose}
          className="cursor-pointer"
        >
          {isOpen
            ? translate("snippets.drawer.hide")
            : translate("snippets.drawer.show")}
        </Button>
      </div>

      {isOpen && (
        <>
          <Separator className="my-3 bg-white/10" size="4" />
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : snippets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-gray-200">
                {translate("snippets.drawer.empty")}
              </div>
            ) : (
              snippets.map((snippet) => (
                <article
                  key={snippet.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0f1623] p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <Badge variant="soft" color="amber" radius="full">
                      {snippet.type}
                    </Badge>
                    <Link
                      className="inline-flex items-center gap-1 text-xs text-blue-200 underline decoration-dotted"
                      href={`/?sequence=${snippet.originSequence.id}`}
                    >
                      <BookOpenText className="h-3 w-3" />
                      {translate("snippets.originLabel")}:
                      <span className="font-semibold">
                        {snippet.originSequence.title}
                      </span>
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                  <Text size="3" weight="medium" className="text-white">
                    {snippet.frame.content}
                  </Text>
                  {snippet.frame.description && (
                    <Text size="2" color="gray">
                      {snippet.frame.description}
                    </Text>
                  )}
                  {snippet.notes && (
                    <div className="rounded-lg bg-white/5 p-3 text-xs text-gray-200">
                      <span className="font-semibold mr-1">
                        {translate("snippets.notesLabel")}:
                      </span>
                      {snippet.notes}
                    </div>
                  )}
                  <Button
                    size="2"
                    className="mt-1 self-start cursor-pointer"
                    onClick={() => onInsert(snippet)}
                  >
                    <FilePlus2 className="h-4 w-4" />
                    {translate("snippets.drawer.insertAction")}
                  </Button>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
