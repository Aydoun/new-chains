"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSequencesByUserQuery } from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { SequenceSkeleton } from "@/components/sequence-skeleton";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { Callout, Text } from "@radix-ui/themes";
import Link from "next/link";
import { SessionLoader } from "@/components/ui/spinner";

export default function Home() {
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetSequencesByUserQuery(session?.user?.id ? undefined : skipToken);
  const isPending = isLoading || isFetching;

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 3000);
    }
  }, [showCreationSuccess]);

  if (status === "loading" || isPending) return <SessionLoader />;

  return (
    <div className="flex flex-col gap-4 px-6 py-0 sm:px-6">
      <div className="min-h-[52px]">
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
      </div>
      <section className="flex flex-col gap-4">
        {!isError ? (
          <>
            <Text data-testid="homepage-title" weight="bold" size="6">
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
