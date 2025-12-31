import { FC, useState } from "react";
import { translate } from "@/lib/i18n";
import { IconButton, TextField } from "@radix-ui/themes";
import { CircleArrowRight, Sparkles, X } from "lucide-react";

interface Props {
  onCreate: (title: string) => void;
}

export const CreateSequenceCta: FC<Props> = ({ onCreate }) => {
  const [sequenceTitle, setSequenceTitle] = useState("");

  return (
    <div className="fixed bottom-6 left-0 z-20 w-full md:left-[256px] md:w-[calc(100%-256px)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center bg-[#121215] border border-gray-200 rounded-full shadow-2xl gap-4 py-4 px-4">
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1 pl-4 pr-2"
            radius="full"
            size="3"
            onChange={(e) => setSequenceTitle(e.target.value)}
            value={sequenceTitle}
          >
            <TextField.Slot>
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
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
            <IconButton
              variant="soft"
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
          </div>
        </div>
      </div>
    </div>
  );
};
