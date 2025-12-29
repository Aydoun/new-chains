import { FC, useState } from "react";
import { translate } from "@/lib/i18n";
import { Button, IconButton, TextField } from "@radix-ui/themes";
import { CircleArrowRight, CircleX, Sparkles } from "lucide-react";

interface Props {
  onCreate: (title: string) => void;
}

export const CreateSequenceCta: FC<Props> = ({ onCreate }) => {
  const [sequenceTitle, setSequenceTitle] = useState("");

  return (
    <div className="fixed bottom-6 left-0 z-20 w-full px-4 md:left-[256px] md:w-[calc(100%-256px)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-center bg-[#121215] border border-gray-200 rounded-full shadow-2xl px-8 py-4">
          {/* <div className="mr-3 text-gray-400">
            <Sparkles className="text-primary-main" />
          </div> */}
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
              <CircleX
                onClick={() => setSequenceTitle("")}
                size="20"
                className="cursor-pointer"
              />
            </TextField.Slot>
          </TextField.Root>
          {/* </TextField.Root>
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1 px-4 py-2 bg-red text-blue"
            radius="full"
            color="mint"
            onChange={(e) => setSequenceTitle(e.target.value)}
            value={sequenceTitle}
          /> */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
            <Button
              variant="surface"
              disabled={!sequenceTitle}
              type="button"
              className="px-6"
              size="3"
              radius="full"
              onClick={() => {
                onCreate(sequenceTitle);
              }}
            >
              <CircleArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
