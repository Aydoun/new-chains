import { FC, useState } from "react";
import { translate } from "@/lib/i18n";
import { Button, TextField } from "@radix-ui/themes";
import { CircleArrowRight, Sparkles } from "lucide-react";

interface Props {
  onCreate: (title: string) => void;
  isLoading: boolean;
}

export const CreateSequenceCta: FC<Props> = ({ onCreate, isLoading }) => {
  const [sequenceTitle, setSequenceTitle] = useState("");

  return (
    <div className="fixed bottom-6 left-0 z-20 w-full px-4 md:left-[256px] md:w-[calc(100%-256px)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-center bg-white dark:bg-[#121215] border border-gray-200 dark:border-white/10 rounded-full shadow-2xl p-1.5 pr-2">
          <div className="pl-4 pr-3 text-gray-400">
            <Sparkles className="text-primary-main" />
          </div>
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1 px-4 py-2"
            radius="full"
            onChange={(e) => setSequenceTitle(e.target.value)}
            value={sequenceTitle}
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
            <Button
              variant="solid"
              // disabled={!SequenceTitle}
              type="button"
              className="px-6"
              radius="full"
              onClick={() => {
                onCreate(sequenceTitle);
              }}
              loading={isLoading}
            >
              <CircleArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
