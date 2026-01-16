"use client";

import { useEffect, useMemo } from "react";

type Modifier = "meta" | "ctrl" | "metaOrCtrl" | "alt" | "shift";

export type KeyboardShortcut = {
  key: string;
  modifier?: Modifier;
  allowInInput?: boolean;
  enabled?: boolean;
  preventDefault?: boolean;
  onTrigger: (event: KeyboardEvent) => void;
};

type Options = {
  enabled?: boolean;
};

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options?: Options
) {
  const normalizedShortcuts = useMemo(
    () =>
      shortcuts.map((shortcut) => ({
        ...shortcut,
        key: shortcut.key.toLowerCase(),
      })),
    [shortcuts]
  );

  useEffect(() => {
    if (options?.enabled === false) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isInputElement = Boolean(
        activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable)
      );

      for (const shortcut of normalizedShortcuts) {
        if (shortcut.enabled === false) continue;
        if (isInputElement && !shortcut.allowInInput) continue;

        const keyMatches = event.key.toLowerCase() === shortcut.key;
        if (!keyMatches) continue;

        const modifierMatches = (() => {
          switch (shortcut.modifier) {
            case "meta":
              return event.metaKey;
            case "ctrl":
              return event.ctrlKey;
            case "metaOrCtrl":
              return event.metaKey || event.ctrlKey;
            case "alt":
              return event.altKey;
            case "shift":
              return event.shiftKey;
            default:
              return true;
          }
        })();

        if (!modifierMatches) continue;

        if (shortcut.preventDefault ?? true) {
          event.preventDefault();
        }

        shortcut.onTrigger(event);
        break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [normalizedShortcuts, options?.enabled]);
}

export type ShortcutHint = {
  keys: string[];
  label: string;
};
