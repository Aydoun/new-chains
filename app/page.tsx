"use client";

import { useEffect, useMemo, useState } from "react";

import { CollectionCard } from "@/components/collection-card";
import { CollectionSkeleton } from "@/components/collection-skeleton";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { carouselItems } from "./fixtures/carousel-items";

type Collection = {
  id: number;
  title: string;
  description: string;
  url?: string | null;
};

type ErrorPayload = {
  message?: string;
};

const FALLBACK_IMAGE = "/globe.svg";

function isCollectionArray(data: unknown): data is Collection[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as Collection).id === "number" &&
        typeof (item as Collection).title === "string" &&
        typeof (item as Collection).description === "string"
    )
  );
}

function resolveErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as ErrorPayload).message === "string"
  ) {
    return (payload as ErrorPayload).message;
  }

  return "Failed to load collections";
}

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const controller = new AbortController();
    let isActive = true;

    const loadCollections = async () => {
      setPending(true);
      setError(null);

      try {
        const response = await fetch("/api/collection/read", {
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as unknown;

        if (!response.ok) {
          throw new Error(resolveErrorMessage(payload));
        }

        if (isActive && isCollectionArray(payload)) {
          setCollections(payload);
        } else if (isActive) {
          setCollections([]);
        }
      } catch (fetchError) {
        if (!isActive) return;
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load collections"
        );
      } finally {
        if (isActive) setPending(false);
      }
    };

    loadCollections();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  if (pending) {
    return (
      <div className="flex flex-col gap-8 p-8 px-0 sm:items-start">
        <Carousel frames={frames} />

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CollectionSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-8 px-0 sm:items-start">
        <Carousel frames={frames} />

        <div
          role="alert"
          className="w-full rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          Failed to load collections: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 px-0 sm:items-start">
      <Carousel frames={frames} />

      <section className="w-full space-y-4">
        <header className="flex flex-col gap-1">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Collections
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-white">
            Featured picks for you
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse curated collections from the community.
          </p>
        </header>

        {collections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No collections available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                title={collection.title}
                description={collection.description}
                imageSrc={collection.url || FALLBACK_IMAGE}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
