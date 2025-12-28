"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useDeleteSequenceMutation,
  useGetSequencesByUserQuery,
} from "./services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { CreateSequenceForm } from "@/components/ui/create-sequence";
import { translate } from "@/lib/i18n";
import { Callout, Text } from "@radix-ui/themes";
import Link from "next/link";
import { SessionLoader } from "@/components/ui/spinner";
import { ViewSequence } from "@/components/ui/view-sequence";
import { Sequence } from "./types";
// import { useSearchParams } from "next/navigation";

export default function Home() {
  // const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showCreationSuccess, setShowCreationSuccess] = useState(false);
  const currentDisplayedSequence = useRef<Sequence | null>(null);
  const userId = session?.user?.id;
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetSequencesByUserQuery(userId ?? skipToken);
  const [deleteSequence, { isLoading: isDeleting }] =
    useDeleteSequenceMutation();
  const isPending = isLoading || isFetching;
  // const sequenceIdParam = searchParams?.get("sequence");

  useEffect(() => {
    if (showCreationSuccess) {
      setTimeout(() => setShowCreationSuccess(false), 3000);
    }
  }, [showCreationSuccess]);

  const handleDelete = async (sequenceId: string | number) => {
    try {
      await deleteSequence(sequenceId).unwrap();
    } catch (error) {
      console.error("Unable to delete sequence right now.", error);
    }
  };

  // useEffect(() => {
  //   if (sequenceIdParam) {
  //   }
  // }, [sequenceIdParam]);

  if (status === "loading" || isPending) return <SessionLoader />;

  return (
    <div className="flex flex-col gap-4 px-6 py-0 sm:px-6">
      <div className="flex gap-6">
        <Text
          data-testid="homepage-title"
          className="self-center"
          weight="bold"
          size="6"
        >
          {translate("navigation.explore")}
        </Text>
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
      </div>
      <section className="flex flex-col gap-4 pb-24">
        {!isError ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sequences?.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  userId={userId}
                  sequence={sequence}
                  onClick={() => {
                    setIsViewDialogOpen(true);
                    currentDisplayedSequence.current = sequence;
                  }}
                  handleDelete={handleDelete}
                />
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
      {isViewDialogOpen && (
        <ViewSequence
          sequence={currentDisplayedSequence.current}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </div>
  );
}
