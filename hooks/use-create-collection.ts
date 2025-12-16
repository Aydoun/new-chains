"use client";

import { useCallback } from "react";

import { useCreateCollectionFromFrameIdsMutation } from "@/app/services/collections";
import type { Collection, CreateCollectionRequest } from "@/app/types";

export function useCreateCollectionFromFrameIds() {
  const [createCollectionFromFrameIds, mutationState] =
    useCreateCollectionFromFrameIdsMutation();

  const createCollection = useCallback(
    async (payload: CreateCollectionRequest): Promise<Collection> => {
      const response = await createCollectionFromFrameIds(payload);
      return response.unwrap();
    },
    [createCollectionFromFrameIds]
  );

  return {
    createCollection,
    ...mutationState,
  };
}
