"use client";

import { useMemo, useState } from "react";
import { translate } from "@/lib/i18n";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Modal } from "@/components/ui/modal";
import { Badge, Flex, Separator, Text } from "@radix-ui/themes";
import { HelpCircle, Keyboard } from "lucide-react";
import { ShortcutHint, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const KEYBOARD_SHORTCUT_HINTS = (): ShortcutHint[] => [
  {
    keys: ["N"],
    label: translate("shortcuts.actions.newChain"),
  },
  {
    keys: ["S"],
    label: translate("shortcuts.actions.save"),
  },
  {
    keys: ["Cmd/Ctrl", "Enter"],
    label: translate("shortcuts.actions.run"),
  },
  {
    keys: ["?"],
    label: translate("shortcuts.actions.openHelp"),
  },
  {
    keys: ["Cmd/Ctrl", "B"],
    label: translate("shortcuts.actions.toggleSidebar"),
  },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts(
    [
      {
        key: "?",
        allowInInput: true,
        onTrigger: () => setOpen(true),
      },
    ],
    { enabled: true }
  );

  const hintList = useMemo(KEYBOARD_SHORTCUT_HINTS, []);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-shortcut-help
            aria-label={translate("shortcuts.helpTooltip")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#92a9c9] shadow-md transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <HelpCircle className="h-5 w-5" aria-hidden />
            <span className="hidden md:inline">{translate("shortcuts.title")}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{translate("shortcuts.helpTooltip")}</TooltipContent>
      </Tooltip>

      {open ? (
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content className="max-w-lg rounded-2xl border border-white/10 bg-[#0f1723] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Text size="6" weight="bold" className="text-white">
                  {translate("shortcuts.title")}
                </Text>
                <Text size="2" color="gray">
                  {translate("shortcuts.description")}
                </Text>
              </div>
              <Modal.Close aria-label={translate("common.close")}>×</Modal.Close>
            </div>

            <Separator size="4" className="my-4 border-white/10" />

            <div className="flex flex-col gap-3">
              {hintList.map((hint) => (
                <Flex
                  key={hint.label}
                  align="center"
                  justify="between"
                  className="rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-white">
                    <Keyboard className="h-4 w-4 text-primary" aria-hidden />
                    <Text size="2" weight="medium">
                      {hint.label}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    {hint.keys.map((key) => (
                      <Badge key={key} variant="soft" color="indigo" className="uppercase">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </Flex>
              ))}
            </div>
          </Modal.Content>
        </Modal>
      ) : null}
    </>
  );
}
