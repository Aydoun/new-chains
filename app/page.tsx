"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { carouselItems } from "./fixtures/carousel-items";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PageFormValues = {
  title: string;
  pages: {
    content: string;
    description?: string;
  }[];
};

const createEmptyPage = () => ({
  content: "",
  description: "",
});

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const frames = useMemo(
    () =>
      carouselItems.map((item) => (
        <CarouselFrame key={item.id}>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </CarouselFrame>
      )),
    []
  );
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      title: "",
      pages: [createEmptyPage()],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "pages",
  });
  const collectionTitle = watch("title");

  const handleNextFrame = () => {
    setActiveFrame((index) => {
      const nextIndex = index + 1;
      if (nextIndex >= fields.length) {
        append(createEmptyPage());
      }
      return nextIndex;
    });
  };

  const handlePreviousFrame = () => {
    setActiveFrame((index) => Math.max(index - 1, 0));
  };

  useEffect(() => {
    if (fields.length === 0) {
      append(createEmptyPage());
    }
    if (activeFrame >= fields.length) {
      setActiveFrame(Math.max(fields.length - 1, 0));
    }
  }, [activeFrame, append, fields.length]);

  const pageFrames = fields.map((field, index) => (
    <CarouselFrame
      key={field.id}
      className="h-auto items-stretch justify-start gap-4 bg-card p-6 text-left shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`page-${index}-content`}
          >
            Frame content
          </label>
          <Input
            id={`page-${index}-content`}
            placeholder="Add a heading or page title"
            {...register(`pages.${index}.content`, {
              required: "Content is required",
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
            Optional description
          </label>
          <Textarea
            id={`page-${index}-description`}
            placeholder="Add supporting details for this frame"
            {...register(`pages.${index}.description`)}
          />
        </div>
      </div>
    </CarouselFrame>
  ));

  const onSubmit = (values: PageFormValues) => {
    console.info("Collection saved", values);
    setIsDialogOpen(false);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setActiveFrame(0);
    }
  };

  return (
    <div className="flex flex-col gap-12 p-8 px-0 sm:items-start">
      <Carousel frames={frames} />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
          <div className="flex items-center gap-3 rounded-full border bg-background/90 px-5 py-3 shadow-lg backdrop-blur">
            <Input
              placeholder="Name your collection"
              className="flex-1"
              {...register("title", { required: "A collection title is required" })}
            />
            <DialogTrigger asChild>
              <Button type="button" size="lg" className="rounded-full px-6">
                Open page form
              </Button>
            </DialogTrigger>
          </div>
          {errors.title && (
            <p className="mt-2 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Build your collection</DialogTitle>
            <DialogDescription>
              {collectionTitle || "Add a title to describe this collection."}
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Pages</p>
              <Carousel
                frames={pageFrames}
                className="w-full"
                currentIndex={activeFrame}
                onIndexChange={setActiveFrame}
                onNext={handleNextFrame}
                onPrevious={handlePreviousFrame}
                loop={false}
              />
            </div>

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save collection</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
