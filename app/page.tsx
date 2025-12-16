"use client";

import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCollectionsByUserQuery } from "./services/collections";
import { CollectionCard } from "@/components/collection-card";
import { CollectionSkeleton } from "@/components/collection-skeleton";
import { CreateCollectionForm } from "@/components/ui/create-collection";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: collections,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCollectionsByUserQuery(localStorage.getItem("userId") ?? skipToken);
  const isPending = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-10 p-6 sm:p-8">
      <section className="flex flex-col gap-4">
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
              ? `Unable to load collections (status ${
                  (error as { status?: number }).status
                }).`
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
      </section>
      <CreateCollectionForm
        isDialogOpen={isDialogOpen}
        handleDialogChange={(open) => {
          setIsDialogOpen(open);
        }}
      />
    </div>
  );
}
