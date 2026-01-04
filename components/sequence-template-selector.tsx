"use client";

import { useState } from "react";
import { SequenceTemplate } from "@/app/types";
import { Modal } from "./ui/modal";
import { Badge, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { ArrowRight, Eye, Layers3, ListOrdered, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: SequenceTemplate[];
  onSelect: (template: SequenceTemplate) => void;
};

export function SequenceTemplateSelector({
  open,
  onOpenChange,
  templates,
  onSelect,
}: Props) {
  const [previewTemplate, setPreviewTemplate] = useState<
    SequenceTemplate | null
  >(null);

  const handlePreviewClose = (open: boolean) => {
    if (!open) {
      setPreviewTemplate(null);
    }
  };

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <Modal.Content className="relative w-full max-w-5xl rounded-3xl bg-[#0b0d14] p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Heading size="6" weight="medium" className="text-white">
                  Start from a template
                </Heading>
                <Text size="3" color="gray">
                  Pick a curated starting point to pre-populate your chain with
                  suggested steps.
                </Text>
              </div>
              <Modal.Close
                aria-label="Close template selector"
                className="rounded-full bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Modal.Close>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <Heading size="4" weight="medium" className="text-white">
                        {template.title}
                      </Heading>
                      <Badge color="indigo" variant="soft">
                        {template.steps.length} steps
                      </Badge>
                    </div>
                    <Text size="2" color="gray">
                      {template.description}
                    </Text>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                        <Layers3 className="h-4 w-4" aria-hidden />
                        Expected outcome
                      </div>
                      <Text size="2" color="gray" className="mt-1">
                        {template.outcome}
                      </Text>
                    </div>
                  </div>
                  <Flex justify="between" align="center">
                    <Button
                      variant="ghost"
                      color="gray"
                      className="hover:bg-white/10"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button onClick={() => onSelect(template)}>
                      Use template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Flex>
                </div>
              ))}
            </div>
          </div>
        </Modal.Content>
      </Modal>

      {previewTemplate && (
        <Modal open onOpenChange={handlePreviewClose}>
          <Modal.Content className="relative w-full max-w-4xl rounded-3xl bg-[#0b0d14] p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Heading size="5" weight="medium" className="text-white">
                  {previewTemplate.title}
                </Heading>
                <Text size="3" color="gray">
                  {previewTemplate.description}
                </Text>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  <ListOrdered className="h-4 w-4" aria-hidden />
                  {previewTemplate.steps.length} recommended steps
                </div>
              </div>
              <Modal.Close
                aria-label="Close template preview"
                className="rounded-full bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
                onClick={() => setPreviewTemplate(null)}
              >
                <X className="h-4 w-4" />
              </Modal.Close>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <Text
                  size="2"
                  weight="medium"
                  className="text-amber-100"
                >
                  Expected outcome
                </Text>
                <Text size="2" color="gray" className="mt-1 block leading-relaxed">
                  {previewTemplate.outcome}
                </Text>
              </div>
              <div className="space-y-3">
                {previewTemplate.steps.map((step, index) => (
                  <div
                    key={`${previewTemplate.id}-step-${index}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <Text weight="medium" className="text-white">
                        {step.content}
                      </Text>
                    </div>
                    <Text size="2" color="gray" className="mt-2">
                      {step.description}
                    </Text>
                  </div>
                ))}
              </div>
              <Flex justify="end" gap="2">
                <Button
                  variant="ghost"
                  color="gray"
                  className="hover:bg-white/10"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onSelect(previewTemplate);
                    setPreviewTemplate(null);
                    onOpenChange(false);
                  }}
                >
                  Use this template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Flex>
            </div>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}
