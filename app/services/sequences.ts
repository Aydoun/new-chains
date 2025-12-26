"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Sequence, SingleSequence } from "../types";

const API_BASE_URL = `/api/`;

export type BulkCreateFramesResponse = {
  ids: number[];
};

export type SequenceInput = {
  frameOrder: number[];
  title: string;
  userId: string;
};

export type SequenceUpdateInput = {
  title?: string;
  description?: string;
  visibility?: Sequence["visibility"];
};

export const sequenceApi = createApi({
  reducerPath: "sequenceApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    getSequencesByUser: builder.query<Sequence[], string | void>({
      query: (userId) =>
        userId ? `sequence/fetch?id=${userId}` : `sequence/fetch`,
    }),
    getSequenceById: builder.query<SingleSequence, number | string>({
      query: (sequenceId) => `sequence/read?id=${sequenceId}`,
    }),
    createSequence: builder.mutation<Sequence, SequenceInput>({
      query: (input) => ({
        url: "sequence/create",
        method: "POST",
        body: input,
      }),
    }),
    deleteSequence: builder.mutation<{ message: string }, number | string>({
      query: (sequenceId) => ({
        url: `sequence/delete?id=${sequenceId}`,
        method: "DELETE",
      }),
    }),
    updateSequence: builder.mutation<
      Sequence,
      { id: number | string; updates: SequenceUpdateInput }
    >({
      query: ({ id, updates }) => ({
        url: `sequence/update?id=${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetSequencesByUserQuery,
  useCreateSequenceMutation,
  useLazyGetSequenceByIdQuery,
  useDeleteSequenceMutation,
  useUpdateSequenceMutation,
} = sequenceApi;
