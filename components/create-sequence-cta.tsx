import { FC, useState } from "react";
import { translate } from "@/lib/i18n";
import { IconButton, TextField } from "@radix-ui/themes";
import { CircleArrowRight, Sparkles, X } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  onCreate: (title: string) => void;
}

export const CreateSequenceCta: FC<Props> = ({ onCreate }) => {
  const [sequenceTitle, setSequenceTitle] = useState("");

  useKeyboardShortcuts([
    {
      key: "n",
      modifier: "metaOrCtrl",
      allowInInput: true,
      onTrigger: () => {
        const hasTextSelected = window.getSelection()?.toString();
        if (hasTextSelected) return;

        const createButton = document.getElementById("create-sequence-shortcut");
        createButton?.click();
      },
    },
  ]);

  return (
    <div className="fixed bottom-6 left-0 z-20 w-full md:left-[256px] md:w-[calc(100%-256px)]">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center bg-gray-400 border border-gray-200 rounded-full gap-4 py-4 px-4 mx-4 md:mx-0">
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1"
            radius="full"
            size="3"
            onChange={(e) => setSequenceTitle(e.target.value)}
            value={sequenceTitle}
          >
            <TextField.Slot className="bg-white border rounded-full mr-2 md:mr-4">
              <Sparkles className="text-primary-main" />
            </TextField.Slot>
            <TextField.Slot>
              <X
                onClick={() => setSequenceTitle("")}
                size="20"
                className="cursor-pointer"
              />
            </TextField.Slot>
          </TextField.Root>
          <div className="flex items-center gap-2">
            <IconButton
              id="create-sequence-shortcut"
              disabled={!sequenceTitle}
              type="button"
              size="3"
              className="cursor-pointer"
              radius="full"
              onClick={() => {
                onCreate(sequenceTitle);
              }}
            >
              <CircleArrowRight />
            </IconButton>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-[#1f2937] md:text-[#92a9c9] cursor-help">
                  ⌘/Ctrl + N
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {translate("shortcuts.actions.newChain")}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
