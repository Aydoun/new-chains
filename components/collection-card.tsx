import { Collection } from "@/app/types";
import * as Dialog from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface CollectionCardProps {
  collection?: Collection;
  title?: string;
  description?: string;
  imageSrc?: string;
  visibility?: string;
  id?: number | string;
  className?: string;
}

export function CollectionCard({
  collection,
  title,
  description,
  imageSrc,
  visibility,
  id,
  className,
}: CollectionCardProps) {
  const PLACEHOLDER_IMAGE = "/image-placeholder.svg";
  const resolvedTitle =
    collection?.title ?? title ?? translate("collections.fallbackTitle");
  const resolvedDescription =
    collection?.description ?? description ?? translate("collections.noDescription");
  const resolvedId = collection?.id ?? id;
  const resolvedVisibility = collection?.visibility ?? visibility;
  const imageSource = collection?.url || imageSrc || PLACEHOLDER_IMAGE;
  const badgeVisibility =
    resolvedVisibility?.replaceAll("_", " ") ??
    translate("collections.visibilityUnknown");
  const displayId =
    resolvedId !== undefined && resolvedId !== null
      ? translate("collections.collectionLabel", {
          id: resolvedId,
        })
      : translate("collections.collectionWithoutId");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "group flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4 text-left shadow-lg ring-1 ring-gray-800 transition hover:-translate-y-0.5 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-900">
              <img
                src={imageSource}
                alt={translate("collections.avatarAlt", {
                  title: resolvedTitle,
                })}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {resolvedTitle}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    {resolvedId !== undefined && resolvedId !== null
                      ? `#${resolvedId}`
                      : displayId}
                  </span>
                </div>
                <span className="rounded-full bg-gray-700 px-3 py-1 text-[11px] font-medium uppercase text-gray-200">
                  {badgeVisibility}
                </span>
              </div>
              <p className="text-sm text-gray-200">
                {resolvedDescription}
              </p>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <p className="text-xs text-muted-foreground">
            {translate("collections.tapToPreview")}
          </p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold text-white">
                {resolvedTitle}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                {translate("collections.quickPreview")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={translate("common.close")}
              className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Separator className="my-4 bg-gray-800" />
          <div className="flex flex-col gap-4 text-sm text-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={imageSource}
                  alt={translate("collections.avatarEnlargedAlt", {
                    title: resolvedTitle,
                  })}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-muted-foreground">
                <span className="text-xs uppercase">
                  {displayId}
                </span>
                <span className="text-xs">
                  {translate("collections.visibilityLabel", {
                    visibility: badgeVisibility,
                  })}
                </span>
              </div>
            </div>
            <p>{translate("collections.modalPlaceholder")}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
