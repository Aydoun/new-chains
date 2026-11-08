"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Button, Spinner, Text } from "@radix-ui/themes";
import { ImagePlus, Trash2 } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { useUploadImageMutation } from "@/app/services/assets";
import type { UploadedAsset } from "@/app/types";
import {
  IMAGE_RULES,
  imageErrorParams,
  validateImage,
} from "@/lib/image-validation";
import { readImageMeta } from "@/lib/read-image";

type Props = {
  /** 1-based frame number, for labels. */
  index: number;
  asset?: UploadedAsset | null;
  onChange: (asset: UploadedAsset | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
};

/**
 * Optional picture for one frame: checks the file in the browser, uploads
 * it, and previews it. The server repeats every check.
 */
export function FrameImageField({
  index,
  asset,
  onChange,
  onUploadingChange,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const errorMessage = (code: string) =>
    t(`images.errors.${code}`, imageErrorParams);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Let the same file be picked again after a failure.
    event.target.value = "";
    if (!file) return;

    setError(null);
    try {
      const code = validateImage(await readImageMeta(file));
      if (code) {
        setError(errorMessage(code));
        return;
      }
    } catch {
      setError(errorMessage("type"));
      return;
    }

    onUploadingChange?.(true);
    try {
      onChange(await uploadImage(file).unwrap());
    } catch (err) {
      const code = (err as { data?: { code?: string } })?.data?.code;
      setError(errorMessage(code ?? "upload"));
    } finally {
      onUploadingChange?.(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_RULES.contentTypes.join(",")}
        aria-label={t("images.add")}
        className="hidden"
        onChange={handleFile}
      />
      {asset ? (
        <div className="flex items-center gap-3">
          <Image
            src={asset.url}
            alt={t("images.preview", { index })}
            width={asset.width}
            height={asset.height}
            unoptimized
            className="h-20 w-auto rounded-md object-contain bg-black/20"
          />
          <Button
            type="button"
            variant="soft"
            color="red"
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {t("images.remove")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="soft"
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            {isLoading ? <Spinner /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
            {isLoading ? t("images.uploading") : t("images.add")}
          </Button>
          <Text size="1" className="text-gray-400">
            {t("images.hint", imageErrorParams)}
          </Text>
        </div>
      )}
      {error && (
        <Text role="alert" className="text-sm text-destructive">
          {error}
        </Text>
      )}
    </div>
  );
}
