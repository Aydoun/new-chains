"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { skipToken } from "@reduxjs/toolkit/query";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { carouselItems } from "./fixtures/carousel-items";
import { useGetCollectionsByUserQuery } from "./services/collections";
import type { Collection } from "./types";

const PLACEHOLDER_IMAGE = "/image-placeholder.svg";

function CollectionCard({ collection }: { collection: Collection }) {
  const imageSource =
    collection.url && collection.url.trim().length > 0
      ? collection.url
      : PLACEHOLDER_IMAGE;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="group flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4 text-left shadow-lg ring-1 ring-gray-800 transition hover:-translate-y-0.5 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-900">
              <img
                src={imageSource}
                alt={`${collection.title} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {collection.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    #{collection.id}
                  </span>
                </div>
                <span className="rounded-full bg-gray-700 px-3 py-1 text-[11px] font-medium uppercase text-gray-200">
                  {collection.visibility.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-200">
                {collection.description || "No description provided."}
              </p>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <p className="text-xs text-muted-foreground">Tap to preview</p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold text-white">
                {collection.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Quick preview for future collection actions.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
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
                  alt={`${collection.title} avatar enlarged`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-muted-foreground">
                <span className="text-xs uppercase">Collection #{collection.id}</span>
                <span className="text-xs">Visibility: {collection.visibility}</span>
              </div>
            </div>
            <p>
              This modal will soon hold more collection details and actions.
              For now, it provides a placeholder view after selecting a
              collection card.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CollectionSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Separator className="bg-gray-700" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const {
    data: collections,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCollectionsByUserQuery(userId ?? skipToken);

  const isPending = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-10 p-6 sm:p-8">
      <Carousel frames={frames} />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Collections</h2>
            <p className="text-sm text-muted-foreground">
              Pulled dynamically using your user id stored in localStorage.
            </p>
          </div>
          {!userId && (
            <p className="text-xs text-muted-foreground">
              Add a <span className="font-semibold">userId</span> to localStorage
              to load your collections.
            </p>
          )}
        </div>

        {isPending && (
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <CollectionSkeleton key={index} />
            ))}
          </div>
        )}

        {!isPending && isError && (
          <div className="rounded-lg bg-red-900/40 p-4 text-sm text-red-200">
            {"status" in (error as Record<string, unknown>)
              ? `Unable to load collections (status ${(error as { status?: number }).status}).`
              : "Unable to load collections at this time."}
          </div>
        )}

        {!isPending && !isError && collections && collections.length > 0 && (
          <div className="flex w-full flex-wrap gap-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}

        {!isPending && !isError && (!collections || collections.length === 0) && userId && (
          <div className="rounded-lg bg-gray-800/80 p-6 text-center text-sm text-muted-foreground">
            No collections found for this user yet.
          </div>
        )}
      </section>
    </div>
  );
}
