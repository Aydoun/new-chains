import { translate } from "@/lib/i18n";
import { Button, TextField } from "@radix-ui/themes";
import { CircleArrowRight } from "lucide-react";
import { FC } from "react";

interface Props {
  onCreate: () => void;
}

export const CreateSequenceCta: FC<Props> = ({ onCreate }) => {
  return (
    <div className="fixed bottom-6 left-0 z-20 w-full px-4 md:left-[256px] md:w-[calc(100%-256px)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-center bg-white dark:bg-[#121215] border border-gray-200 dark:border-white/10 rounded-full shadow-2xl p-1.5 pr-2">
          <div className="pl-4 pr-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="sparkles"
              className="lucide lucide-sparkles w-5 h-5 text-primary"
            >
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
          </div>
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1"
            radius="full"
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
            <Button
              variant="solid"
              // disabled={!SequenceTitle}
              type="button"
              className="px-6"
              radius="full"
              onClick={onCreate}
              // loading={isSaving || isSequenceSaving}
            >
              <CircleArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
