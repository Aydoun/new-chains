"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, CircleArrowUp } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { Button, TextField, TextArea } from "@radix-ui/themes";
import { useBulkCreateFramesMutation } from "@/app/services/frames";
import { useCreateSequenceMutation } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { Modal } from "@/components/ui/modal";

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
    <CarouselFrame
      key={index}
      className="h-auto items-stretch justify-start gap-4 bg-card p-6 text-left shadow-sm"
    >
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
    </CarouselFrame>
  ));

  if (!session?.user?.id) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="flex items-center gap-3 rounded-full border bg-gray-500 px-5 py-3 shadow-lg backdrop-blur">
          <TextField.Root
            placeholder={translate("sequence.cta.title")}
            className="flex-1"
            {...register("title")}
            radius="full"
          />
          <Button
            variant="solid"
            disabled={!SequenceTitle}
            type="button"
            className="px-6"
            radius="full"
            loading={isSaving || isSequenceSaving}
            onClick={() => onDialogChange(true)}
          >
            <CircleArrowUp />
          </Button>
        </div>
      </div>
      <Modal open={isDialogOpen} onOpenChange={onDialogChange}>
        <Modal.Content className="grid w-full max-w-2xl gap-6 border bg-background p-6 shadow-lg">
          <div className="flex flex-col space-y-1.5 text-left">
            <h2 className="text-lg font-semibold text-foreground">
              {translate("sequence.draft.title")}
            </h2>
            <p className="text-sm text-muted-foreground">{SequenceTitle}</p>
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
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
              <Modal.Close aria-label="Close" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </Modal.Close>
              <Button type="submit">{translate("sequence.cta.publish")}</Button>
            </div>
          </form>
        </Modal.Content>
      </Modal>
    </>
  );
}
