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
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center bg-gray-400 rounded-full gap-4 py-4 px-4 mx-4 md:mx-0">
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1 outline-none"
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
