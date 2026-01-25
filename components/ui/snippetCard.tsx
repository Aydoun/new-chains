import { Frame } from "@/app/types";
import { translate } from "@/lib/i18n";
import { timeAgo } from "@/lib/utils";
import { Tooltip, Text } from "@radix-ui/themes";
import { Info } from "lucide-react";
import { SnippetMenu } from "./snippetMenu";

interface Props {
  frame: Frame;
  notes: string | null | undefined;
  onView: () => void;
  onDelete: () => void;
}

export function SnippetCard({ frame, notes, onView, onDelete }: Props) {
  return (
    <div className="flex items-center bg-frame-primary border border-slate-200 dark:border-border-dark p-6 px-4 md:px-6 rounded shadow-sm mb-4">
      <div className="mr-4">
        <Tooltip
          content={
            notes ??
            translate("snippets.info", {
              time: timeAgo(frame.createdAt),
            })
          }
        >
          <Info className="text-gray-400" />
        </Tooltip>
      </div>
      <div className="flex-grow text-center">
        <blockquote className="text-center text-gray-800 font-serif text-1xl md:text-2xl leading-tight">
          {frame.content}
        </blockquote>
        <Text className="px-8 text-sm text-amber-700 font-medium">
          {frame.description}
        </Text>
      </div>
      <div className="ml-4 flex flex-col items-center space-y-4">
        <SnippetMenu onDelete={onDelete} onView={onView} />
      </div>
    </div>
  );
}
