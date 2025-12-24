"use client";

import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSequencesByUserQuery } from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { SequenceSkeleton } from "@/components/sequence-skeleton";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { getUserIdWithFallback } from "@/lib/utils";
import { Callout, Text } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(true);
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetSequencesByUserQuery(getUserIdWithFallback() ?? skipToken);
  const isPending = isLoading || isFetching;

  if (isPending) {
    return (
      <div className="flex flex-col gap-10 p-6 sm:p-8">
        <SequenceSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-6 sm:p-8">
      {showCreationSuccess && (
        <Callout.Root color="green" role="status">
          <Callout.Text>
            {translate("sequence.cta.creation-message")}{" "}
            <Link
              href="/studio"
              className="font-semibold underline underline-offset-4"
            >
              {translate("navigation.cta.studio-redirect")}
            </Link>
          </Callout.Text>
        </Callout.Root>
      )}
      <section className="flex flex-col gap-4">
        {!isError ? (
          <>
            <Text data-testid="homepage-title">
              {translate("navigation.explore")}
            </Text>
            <div className="flex w-full flex-wrap gap-4">
              {sequences?.map((sequence) => (
                <SequenceCard key={sequence.id} sequence={sequence} />
              ))}
            </div>
          </>
        ) : (
          <div className="m-8 rounded-lg bg-red-900/40 p-4 text-sm text-red-200">
            {translate("common.errors.home")}
          </div>
        )}
      </section>
      <CreateSequenceForm
        isDialogOpen={isDialogOpen}
        handleDialogChange={(open) => {
          setIsDialogOpen(open);
        }}
        onSequenceCreated={() => setShowCreationSuccess(true)}
      />
    </div>
  );
}
