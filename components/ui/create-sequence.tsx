"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Modal } from "./modal";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel } from "@/components/ui/carousel";
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useBulkCreateFramesMutation } from "@/app/services/frames";
import { useCreateSequenceMutation } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";

interface Props {
  onClose: () => void;
  onSequenceCreated?: (title: string) => void;
  initialSequenceTitle: string;
}

export type PageFormValues = {
  title: string;
  description?: string;
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
  onClose,
  onSequenceCreated,
  initialSequenceTitle,
}: Props) {
  const { data: session } = useSession();
  const [activeFrame, setActiveFrame] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [bulkCreateFrames, { isLoading: isSaving }] =
    useBulkCreateFramesMutation();
  const [createSequenceMutation, { isLoading: isSequenceSaving }] =
    useCreateSequenceMutation();
  const {
    control,
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<PageFormValues>({
    defaultValues: {
      title: initialSequenceTitle,
      description: "",
      pages: [createEmptyFrame()],
    },
  });
  const { append } = useFieldArray({
    control,
    name: "pages",
  });

  const SequenceTitle = watch("title");
  const sequenceDescription = watch("description");
  const pages = watch("pages");

  const getStepLabel = (step: number, total: number) => {
    const label = translate("common.step", { step, total });
    if (label === "common.step") return `Step ${step} of ${total}`;
    return label;
  };

  const getFrameProgressLabel = (current: number, total: number) => {
    const label = translate("carousel.progress", { current, total });
    if (label === "carousel.progress") return `Frame ${current} of ${total}`;
    return label;
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        label: translate("sequence.draft.firstStepTitle"),
      },
      {
        id: 2,
        label: translate("sequence.draft.secondStepTitle"),
      },
    ],
    []
  );

  const onModalChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
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

  const handleStepAdvance = () => {
    const trimmedTitle = SequenceTitle?.trim();
    if (!trimmedTitle) {
      setError("title", {
        type: "required",
        message: translate("common.required"),
      });
      return;
    }
    clearErrors("title");
    setCurrentStep(1);
  };

  const handleBackToDetails = () => setCurrentStep(0);

  const onPreviousSlide = () => {
    setActiveFrame((previous) => previous - 1);
  };

  const onSubmit = async (values: PageFormValues) => {
    if (!values.title?.trim()) {
      setError("title", {
        type: "required",
        message: translate("common.required"),
      });
      setCurrentStep(0);
      return;
    }
    onModalChange(false);
    const framesPayload = values.pages
      .filter((frame) => frame.content.trim().length > 0)
      .map((frame) => ({
        ...frame,
        content: frame.content.trim(),
        description: frame.description?.trim() || "",
      }));

    if (framesPayload.length > 0) {
      try {
        const frameResult = await bulkCreateFrames(framesPayload).unwrap();

        const createdSequence = await createSequenceMutation({
          frameOrder: frameResult?.ids ?? [],
          userId: session?.user?.id ?? "",
          title: values.title,
          description: values.description?.trim() || undefined,
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
    <div className="flex flex-col gap-4 w-full" key={`page-${index}`}>
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
          variant="soft"
          radius="large"
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
          {translate("sequence.draft.descriptionLabel")}
        </label>
        <TextArea
          id={`page-${index}-description`}
          placeholder={translate("sequence.draft.description")}
          variant="soft"
          radius="large"
          {...register(`pages.${index}.description`)}
        />
      </div>
    </div>
  ));

  if (!session?.user?.id) return null;

  return (
    <Modal open onOpenChange={onModalChange}>
      <Modal.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0b0d14] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <Badge color="orange" radius="full">
              {getStepLabel(currentStep + 1, steps.length)}
            </Badge>
            <Heading size="6" weight="medium" className="text-white">
              {SequenceTitle?.trim()}
            </Heading>
          </div>
          <Modal.Close
            aria-label="Close"
            className="rounded-full bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Modal.Close>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            return (
              <div key={step.id} className="flex flex-1 items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    isActive
                      ? "border-amber-400 bg-amber-500/20 text-amber-100 shadow-[0_0_0_2px_rgba(251,191,36,0.15)]"
                      : "border-white/10 bg-white/10 text-gray-200"
                  }`}
                  aria-label={step.label}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="flex flex-col">
                  <Text
                    color={isActive ? "orange" : "gray"}
                    size="2"
                    weight="medium"
                  >
                    {step.label}
                  </Text>
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-auto hidden h-px flex-1 bg-white/10 sm:block" />
                )}
              </div>
            );
          })}
        </div>

        <form
          className="mt-6 flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentStep === 0 ? (
            <div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="flex items-center justify-between text-sm font-medium text-white"
                      htmlFor="sequence-title"
                    >
                      <Text>{translate("sequence.draft.title")}</Text>
                      <Badge color="orange" radius="full" variant="solid">
                        {translate("common.required")}
                      </Badge>
                    </label>
                    <TextField.Root
                      id="sequence-title"
                      {...register("title", {
                        required: translate("common.required"),
                      })}
                      radius="large"
                      className="bg-none"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <label
                      className="text-sm font-medium text-white"
                      htmlFor="sequence-description"
                    >
                      {translate("sequence.draft.description") ||
                        "Description (optional)"}
                    </label>
                    <TextArea
                      id="sequence-description"
                      {...register("description")}
                      radius="large"
                    />
                    {sequenceDescription && (
                      <Text color="gray" size="1">
                        {sequenceDescription.length}{" "}
                        {translate("common.characters") || "characters"}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <Carousel
                frames={pageFrames}
                className="w-full"
                currentIndex={activeFrame}
                onNext={onNextSlide}
                onPrevious={onPreviousSlide}
                isEditMode
                frameContainerClassName="bg-[#0f1118] border border-white/10 rounded-xl"
                renderControls={(props) => (
                  <Flex align="center" justify="between">
                    <IconButton
                      variant="surface"
                      color="gray"
                      radius="full"
                      onClick={props.onPrevious}
                      disabled={props.currentIndex === 0}
                      aria-label={translate("carousel.previous") || "Previous"}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">
                        {translate("carousel.previous") || "Previous"}
                      </span>
                    </IconButton>
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white">
                      <span className="text-xs uppercase tracking-wide text-amber-200">
                        {getStepLabel(
                          props.currentIndex + 1,
                          pageFrames.length
                        )}
                      </span>
                      <span className="text-gray-300">
                        {getFrameProgressLabel(
                          props.currentIndex + 1,
                          pageFrames.length
                        )}
                      </span>
                    </div>
                    <IconButton
                      variant="solid"
                      color="amber"
                      radius="full"
                      onClick={props.onNext}
                      aria-label={translate("carousel.next") || "Next"}
                    >
                      <span className="sr-only">
                        {translate("carousel.next") || "Next"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </IconButton>
                  </Flex>
                )}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            {currentStep === 0 ? (
              <Button type="button" variant="solid" onClick={handleStepAdvance}>
                {translate("common.continue")}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="surface"
                  color="gray"
                  onClick={handleBackToDetails}
                >
                  {translate("common.back") || "Back to details"}
                </Button>
                <Button
                  type="submit"
                  color="amber"
                  loading={isSaving || isSequenceSaving}
                >
                  {translate("sequence.cta.publish")}
                </Button>
              </>
            )}
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
