"use client";

import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSequencesByUserQuery } from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { SequenceSkeleton } from "@/components/sequence-skeleton";
import { CreateSequenceForm } from "@/components/ui/create-sequence";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetSequencesByUserQuery(localStorage.getItem("userId") ?? skipToken);
  const isPending = isLoading || isFetching;

  if (isPending) {
    return (
      <div className="flex flex-wrap gap-4 p-6 sm:p-8">
        <SequenceSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-8 rounded-lg bg-red-900/40 p-4 text-sm text-red-200">
        Unable to load sequences at this time.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-6 sm:p-8">
      <section className="flex flex-col gap-4">
        <div className="flex w-full flex-wrap gap-4">
          {sequences?.map((sequence) => (
            <SequenceCard key={sequence.id} sequence={sequence} />
          ))}
        </div>
      </section>
      <CreateSequenceForm
        isDialogOpen={isDialogOpen}
        handleDialogChange={(open) => {
          setIsDialogOpen(open);
        }}
      />
    </div>
  );
}
