import { Frame } from "@/app/types";
import { translate } from "@/lib/i18n";
import { timeAgo } from "@/lib/utils";
import { Tooltip } from "@radix-ui/themes";
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
    <div className="flex items-center bg-frame-primary border border-slate-200 dark:border-border-dark p-6 rounded shadow-sm group mb-4">
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
        <h2 className="font-display text-2xl text-gray-800 lg:text-3xl">
          {frame.content}
        </h2>
        <p className=" mt-2 text-sm text-amber-700 tracking-wider font-medium">
          {frame.description}
        </p>
      </div>
      <div className="ml-4 flex flex-col items-center space-y-4">
        <SnippetMenu onDelete={onDelete} onView={onView} />
      </div>
    </div>
  );
}
