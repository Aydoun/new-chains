"use client";

import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  PlusCircle,
  X,
} from "lucide-react";
import { Modal } from "./modal";
import { useFieldArray, useForm } from "react-hook-form";
import { Carousel } from "@/components/ui/carousel";
import {
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useBulkCreateFramesMutation } from "@/app/services/frames";
import { useCreateSequenceMutation } from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { SequenceCreationFormValues, SequenceTemplate } from "@/app/types";

interface Props {
  onClose: () => void;
  onSequenceCreated?: (title: string) => void;
  initialSequenceTitle: string;
  initialTemplate?: SequenceTemplate | null;
}

const createEmptyFrame = () => ({
  content: "",
  description: "",
});

export function CreateSequenceForm({
  onClose,
  onSequenceCreated,
  initialSequenceTitle,
  initialTemplate = null,
}: Props) {
  const { data: session } = useSession();
  const [activeFrame, setActiveFrame] = useState(0);
  const [currentStep, setCurrentStep] = useState(initialTemplate ? 1 : 0);
  const [bulkCreateFrames, { isLoading: isSaving }] =
    useBulkCreateFramesMutation();
  const [createSequenceMutation, { isLoading: isSequenceSaving }] =
    useCreateSequenceMutation();
  const {
    control,
    register,
    watch,
    setError,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<SequenceCreationFormValues>({
    mode: "onChange",
    defaultValues: {
      title: initialTemplate?.title ?? initialSequenceTitle,
      description: initialTemplate?.description ?? "",
      pages:
        initialTemplate?.steps && initialTemplate.steps.length > 0
          ? initialTemplate.steps.map((step) => ({
              content: step.content,
              description: step.description,
            }))
          : [createEmptyFrame()],
    },
  });
  const { append } = useFieldArray({
    control,
    name: "pages",
  });

  const SequenceTitle = watch("title");
  const pages = watch("pages");
  const trimmedTitle = SequenceTitle?.trim() ?? "";
  const hasValidFrames = useMemo(
    () => pages.some((frame) => frame.content.trim().length > 0),
    [pages]
  );

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

    if (!lastSlideContent || lastSlideContent.length === 0) {
      setError(`pages.${activeFrame}.content`, {
        type: "required",
        message: translate("common.required"),
      });
    } else {
      setActiveFrame((previous) => previous + 1);
    }
  };

  const handleStepAdvance: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentStep(1);
  };

  const onPreviousSlide = () => {
    if (activeFrame === 0) {
      setCurrentStep(0);
    } else {
      setActiveFrame((previous) => Math.max(previous - 1, 0));
    }
  };

  const onSubmit = async (values: SequenceCreationFormValues) => {
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
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
        }).unwrap();

        if (onSequenceCreated) onSequenceCreated(createdSequence.title);
      } catch {
        console.error("Unable to save sequence right now. Please try again.");
      }
    }

    onModalChange(false);
  };

  useEffect(() => {
    if (activeFrame > pages.length - 1) {
      append(createEmptyFrame());
    }
  }, [activeFrame, pages.length, append]);

  useEffect(() => {
    if (initialTemplate) {
      setCurrentStep(1);
      setActiveFrame(0);
    }
  }, [initialTemplate]);

  const pageFrames = pages.map((_, index) => (
    <div className="flex flex-col gap-4 w-full" key={`page-${index}`}>
      <div>
        <div className="space-y-2">
          <label className="text-left" htmlFor={`page-${index}-content`}>
            {translate("frame.content")}
          </label>
          <TextField.Root
            id={`page-${index}-content`}
            placeholder={translate("sequence.draft.frameContent-placeholder")}
            {...register(`pages.${index}.content`, {
              required: translate("common.required"),
            })}
            radius="large"
          />
          <Text size="1" color="gray">
            {translate("sequence.draft.frameContent-advice")}
          </Text>
          {errors.pages?.[index]?.content && (
            <p className="text-sm text-destructive">
              {errors.pages[index]?.content?.message}
            </p>
          )}
        </div>
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
          placeholder={translate("sequence.draft.frameDescription-placeholder")}
          radius="large"
          {...register(`pages.${index}.description`)}
        />
      </div>
    </div>
  ));

  if (!session?.user?.id) return null;

  return (
    <Modal open onOpenChange={onModalChange}>
      <Modal.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#0b0d14] p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <Badge color="orange" radius="full">
              {translate("sequence.draft.step", {
                current: currentStep + 1,
                total: steps.length,
              })}
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
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl p-3">
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
                      placeholder={translate(
                        "sequence.draft.title-placeholder"
                      )}
                      {...register("title", {
                        required: translate("common.required"),
                        validate: (value) =>
                          value?.trim().length > 0 ||
                          translate("common.required"),
                      })}
                      radius="large"
                    />
                    <Text size="1" color="gray">
                      {translate("sequence.draft.title-advice")}
                    </Text>
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
                      {translate("sequence.draft.description")}
                    </label>
                    <TextArea
                      id="sequence-description"
                      placeholder={translate(
                        "sequence.draft.description-placeholder"
                      )}
                      {...register("description")}
                      radius="large"
                    />
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
                renderControls={(props) => (
                  <Flex align="center" justify="between">
                    <Button
                      variant="soft"
                      radius="full"
                      type="button"
                      onClick={onPreviousSlide}
                      aria-label={translate("carousel.previous")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white">
                      <Text color="orange" className="tracking-wide">
                        {translate("carousel.progress", {
                          current: props.currentIndex + 1,
                          total: pageFrames.length,
                        })}
                      </Text>
                    </div>
                    <Button
                      radius="full"
                      type="button"
                      onClick={onNextSlide}
                      aria-label={translate("sequence.draft.appendFrame")}
                    >
                      {props.currentIndex === pageFrames.length - 1 ? (
                        <>
                          <PlusCircle className="h-4 w-4" />
                          <Text>{translate("sequence.draft.appendFrame")}</Text>
                        </>
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </Flex>
                )}
              />
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            {currentStep === 0 ? (
              <Button
                type="button"
                disabled={!trimmedTitle}
                variant="solid"
                onClick={handleStepAdvance}
              >
                {translate("common.next")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid || !hasValidFrames}
                loading={isSaving || isSequenceSaving}
              >
                <Cloud />
                {translate("sequence.cta.publish")}
              </Button>
            )}
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
