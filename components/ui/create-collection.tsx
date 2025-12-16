"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { Input } from "./input";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { translate } from "@/lib/i18n";

interface Props {
  isDialogOpen: boolean;
  handleDialogChange: (open: boolean) => void;
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

export function CreateCollectionForm({
  isDialogOpen,
  handleDialogChange,
}: Props) {
  const [activeFrame, setActiveFrame] = useState(0);
  const {
    control,
    register,
    watch,
    setError,
    formState: { errors },
    reset,
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

  const collectionTitle = watch("title");
  const pages = watch("pages");

  const onDialogChange = (open: boolean) => {
    handleDialogChange(open);
    if (!open) {
      reset({
        pages: [createEmptyFrame()],
        title: "",
      });
    }

    setActiveFrame(0);
  };

  const onNextSlide = () => {
    const lastSlideContent = pages?.[activeFrame]?.content?.trim();

    if (!lastSlideContent) {
      setError(`pages.${activeFrame}.content`, {
        type: "required",
        message: translate("createCollection.contentRequired"),
      });
    } else {
      setActiveFrame((previous) => previous + 1);
    }
  };

  const onPreviousSlide = () => {
    setActiveFrame((previous) => previous - 1);
  };

  const onSubmit = () => {
    console.log(translate("createCollection.savedMessage"), {
      pages,
      collectionTitle,
    });
    onDialogChange(false);
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
            {translate("createCollection.contentLabel")}
          </label>
          <Input
            id={`page-${index}-content`}
            placeholder={translate("createCollection.contentPlaceholder")}
            {...register(`pages.${index}.content`, {
              required: translate("createCollection.contentRequired"),
            })}
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
            {translate("createCollection.descriptionLabel")}
          </label>
          <Textarea
            id={`page-${index}-description`}
            placeholder={translate("createCollection.descriptionPlaceholder")}
            {...register(`pages.${index}.description`)}
          />
        </div>
      </div>
    </CarouselFrame>
  ));

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
      <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="flex items-center gap-3 rounded-full border bg-background/90 px-5 py-3 shadow-lg backdrop-blur">
          <Input
            placeholder={translate("createCollection.namePlaceholder")}
            className="flex-1"
            {...register("title", {
              required: translate("createCollection.titleRequired"),
            })}
          />
          <DialogTrigger asChild>
            <Button
              disabled={!collectionTitle}
              size="lg"
              type="button"
              className="rounded-full px-6"
            >
              {translate("createCollection.openForm")}
            </Button>
          </DialogTrigger>
        </div>
      </div>
      {isDialogOpen && (
        <DialogPortal>
          <DialogOverlay
            className={
              "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            }
          />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex flex-col space-y-1.5 text-left">
              <DialogTitle>
                {translate("createCollection.dialogTitle")}
              </DialogTitle>
              <DialogDescription>{collectionTitle}</DialogDescription>
            </div>
            <form className="flex flex-col gap-6">
              <div className="space-y-3">
                <Carousel
                  frames={pageFrames}
                  className="w-full"
                  currentIndex={activeFrame}
                  onNext={onNextSlide}
                  onPrevious={onPreviousSlide}
                />
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2 mt-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    {translate("createCollection.cancel")}
                  </Button>
                </DialogClose>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-4 w-4" />
                </DialogClose>
                <Button onClick={onSubmit}>
                  {translate("createCollection.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      )}
    </Dialog>
  );
}
