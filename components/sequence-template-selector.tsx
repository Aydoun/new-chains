"use client";

import { SequenceTemplate } from "@/app/types";
import { Modal } from "./ui/modal";
import { Badge, Button, Heading, Text } from "@radix-ui/themes";
import { ArrowRight, Layers3, X } from "lucide-react";
import { translate } from "@/lib/i18n";

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
  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <Modal.Content className="relative w-full max-w-5xl rounded-3xl bg-[#0b0d14] p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Heading size="6" weight="medium" className="text-white">
                  {translate("templates.start")}
                </Heading>
                <Text size="3" color="gray">
                  {translate("templates.startDescription")}
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
                  key={template.title}
                  className="flex h-full flex-col justify-between gap-4 rounded-2xl bg-white/5 p-5"
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
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary-main">
                        <Layers3 className="h-4 w-4" aria-hidden />
                        {translate("templates.outcome")}
                      </div>
                      <Text size="2" color="gray" className="mt-1">
                        {template.outcome}
                      </Text>
                    </div>
                  </div>
                  <Button
                    className="cursor-pointer"
                    onClick={() => onSelect(template)}
                  >
                    {translate("templates.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}
