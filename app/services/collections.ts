"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Collection, Sequence } from "../types";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`;

export type BulkCreateFramesResponse = {
  ids: number[];
};

export type CollectionInput = {
  frameOrder: number[];
  title: string;
  userId: string;
};

export const collectionApi = createApi({
  reducerPath: "collectionApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCollectionsByUser: builder.query<Collection[], string>({
      query: (userId) => `collection/read?id=${userId}`,
    }),
    getSequenceById: builder.query<Sequence, number | string>({
      query: (sequenceId) => `sequence/read?id=${sequenceId}`,
    }),
    createCollection: builder.mutation<Collection, CollectionInput>({
      query: (input) => ({
        url: "collection/create",
        method: "POST",
        body: input,
      }),
    }),
  }),
});

export const {
  useGetCollectionsByUserQuery,
  useCreateCollectionMutation,
  useLazyGetSequenceByIdQuery,
} = collectionApi;
