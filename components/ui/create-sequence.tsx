"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, CircleArrowUp } from "lucide-react";
import { Dialog } from "@radix-ui/themes";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { Button, TextField, TextArea } from "@radix-ui/themes";
import { useBulkCreateFramesMutation } from "@/app/services/frames";
import { useCreateSequenceMutation } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { FrameContainer } from "../sequence-card";

interface Props {
  isDialogOpen: boolean;
  handleDialogChange: (open: boolean) => void;
  onSequenceCreated?: (title: string) => void;
}

export type PageFormValues = {
  title: string;
  pages: {
    content: string;
    description?: string;
  }[];
};

const createEmptyFrame = () => ({
  content: "",
  description: "",
});

export function CreateSequenceForm({
  isDialogOpen,
  handleDialogChange,
  onSequenceCreated,
}: Props) {
  const { data: session } = useSession();
  const [activeFrame, setActiveFrame] = useState(0);
  const [bulkCreateFrames, { isLoading: isSaving }] =
    useBulkCreateFramesMutation();
  const [createSequenceMutation, { isLoading: isSequenceSaving }] =
    useCreateSequenceMutation();
  const {
    control,
    register,
    watch,
    setError,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<PageFormValues>({
    defaultValues: {
      title: "",
      pages: [createEmptyFrame()],
    },
  });
  const { append } = useFieldArray({
    control,
    name: "pages",
  });

  const SequenceTitle = watch("title");
  const pages = watch("pages");

  const onDialogChange = (open: boolean) => {
    handleDialogChange(open);
    if (!open) {
      reset({
        pages: [createEmptyFrame()],
        title: SequenceTitle,
      });
    }

    setActiveFrame(0);
  };

  const onNextSlide = () => {
    const lastSlideContent = pages?.[activeFrame]?.content?.trim();

    if (!lastSlideContent) {
      setError(`pages.${activeFrame}.content`, {
        type: "required",
        message: translate("common.required"),
      });
    } else {
      setActiveFrame((previous) => previous + 1);
    }
  };

  const onPreviousSlide = () => {
    setActiveFrame((previous) => previous - 1);
  };

  const onSubmit = async (values: PageFormValues) => {
    onDialogChange(false);
    const framesPayload = values.pages.filter(
      (frame) => frame.content.length > 0
    );

    if (framesPayload.length > 0) {
      try {
        const frameResult = await bulkCreateFrames(framesPayload).unwrap();

        const createdSequence = await createSequenceMutation({
          frameOrder: frameResult?.ids ?? [],
          userId: session?.user?.id ?? "",
          title: values.title,
        }).unwrap();

        if (onSequenceCreated) onSequenceCreated(createdSequence.title);
      } catch {
        console.error("Unable to save sequence right now. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (activeFrame > pages.length - 1) {
      append(createEmptyFrame());
    }
  }, [activeFrame, pages.length, append]);

  const pageFrames = pages.map((_, index) => (
    <FrameContainer className="h-auto items-stretch justify-start gap-4 bg-card p-6 text-left shadow-sm">
      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`page-${index}-content`}
          >
            {translate("frame.content")}
          </label>
          <TextField.Root
            id={`page-${index}-content`}
            placeholder={translate("sequence.cta.title")}
            className="flex-1"
            {...register(`pages.${index}.content`, {
              required: translate("common.required"),
            })}
            radius="full"
          />
          {errors.pages?.[index]?.content && (
            <p className="text-sm text-destructive">
              {errors.pages[index]?.content?.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`page-${index}-description`}
          >
            {translate("frame.description")}
          </label>
          <TextArea
            id={`page-${index}-description`}
            {...register(`pages.${index}.description`)}
          />
        </div>
      </div>
    </FrameContainer>
  ));

  if (!session?.user?.id) return null;

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onDialogChange}>
      <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="flex items-center gap-3 rounded-full border bg-gray-500 px-5 py-3 shadow-lg backdrop-blur">
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1"
            {...register("title")}
            radius="full"
          />
          <Dialog.Trigger>
            <Button
              variant="solid"
              disabled={!SequenceTitle}
              type="button"
              className="px-6"
              radius="full"
              loading={isSaving || isSequenceSaving}
            >
              <CircleArrowUp />
            </Button>
          </Dialog.Trigger>
        </div>
      </div>
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <div className="flex flex-col space-y-1.5 text-left">
          <Dialog.Title>{translate("sequence.draft.title")}</Dialog.Title>
          <Dialog.Description>{SequenceTitle}</Dialog.Description>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <Carousel
              frames={pageFrames}
              className="w-full"
              currentIndex={activeFrame}
              onNext={onNextSlide}
              onPrevious={onPreviousSlide}
              isEditMode
            />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2 mt-2">
            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
            <Button type="submit">{translate("sequence.cta.publish")}</Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
