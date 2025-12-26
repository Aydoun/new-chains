"use client";

import { translate } from "@/lib/i18n";
import { Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSequencesByUserQuery } from "../services/sequences";
import { SequenceCard } from "@/components/sequence-card";
import { SessionLoader } from "@/components/ui/spinner";

type StudioPageProps = {
  searchParams?: {
    user?: string;
  };
};

export default function StudioPage({ searchParams }: StudioPageProps) {
  const { data: session, status } = useSession();
  const ownerId = searchParams?.user ?? session?.user?.id;
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetSequencesByUserQuery(ownerId ?? skipToken);
  const isBusy = status === "loading" || isLoading || isFetching;
  const studioOwnerName =
    sequences?.[0]?.user?.username || session?.user?.name || "Your";

  if (isBusy) return <SessionLoader />;

  return (
    <div className="p-6 sm:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Text weight="bold" size="6">
            {translate("navigation.studio")}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {`${studioOwnerName}'s sequences`}
          </Text>
        </div>
      </div>

      {isError && (
        <div className="rounded-lg bg-red-900/40 p-4 text-sm text-red-200">
          {translate("common.errors.home")}
        </div>
      )}

      {!isError && (
        <div className="flex flex-wrap gap-4">
          {sequences?.length ? (
            sequences.map((sequence) => (
              <SequenceCard key={sequence.id} sequence={sequence} />
            ))
          ) : (
            <div className="min-h-32 w-full rounded-md border border-dashed border-muted p-6 text-muted-foreground">
              No sequences available yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
