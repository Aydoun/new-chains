"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Button, Text, TextField } from "@radix-ui/themes";
import { Link2, Trash2 } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { FRAME_LINK_MAX_LENGTH } from "@/lib/frame-link";

type Props = {
  /** 1-based frame number, for labels. */
  index: number;
  /** The form's registration of this frame's `linkUrl`. */
  registration: UseFormRegisterReturn;
  value?: string;
  error?: string;
  onRemove: () => void;
};

/**
 * Optional web link for one frame. Collapsed to an "Add link" button until
 * used; the form checks the value with `parseFrameLink`, and so does the API.
 */
export function FrameLinkField({ index, registration, value, error, onRemove }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(Boolean(value));
  const errorId = `frame-${index}-link-error`;

  if (!open && !value) {
    return (
      <div className="flex w-full max-w-2xl">
        <Button type="button" variant="soft" onClick={() => setOpen(true)}>
          <Link2 className="h-4 w-4" aria-hidden="true" />
          {t("frame.link.add")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* type="text", not "url": the browser's own URL check refuses a bare
            "example.com", which parseFrameLink accepts (adding https://). */}
        <TextField.Root
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          maxLength={FRAME_LINK_MAX_LENGTH}
          placeholder={t("frame.link.placeholder")}
          aria-label={t("frame.link.label", { index })}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="flex-1"
          autoFocus={!value}
          {...registration}
        >
          <TextField.Slot>
            <Link2 className="h-4 w-4" aria-hidden="true" />
          </TextField.Slot>
        </TextField.Root>
        <Button
          type="button"
          variant="soft"
          color="red"
          onClick={() => {
            onRemove();
            setOpen(false);
          }}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {t("frame.link.remove")}
        </Button>
      </div>
      {error ? (
        <Text id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </Text>
      ) : (
        <Text size="1" className="text-gray-400">
          {t("frame.link.hint")}
        </Text>
      )}
    </div>
  );
}
