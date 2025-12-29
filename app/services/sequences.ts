"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Sequence, SingleSequence } from "../types";

const API_BASE_URL = `/api/`;

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedSequencesResponse = {
  items: Sequence[];
  page: number;
  totalPages: number;
  hasMore: boolean;
};

export type BulkCreateFramesResponse = {
  ids: number[];
};

export type SequenceInput = {
  frameOrder: number[];
  title: string;
  userId: string;
  description?: string;
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
    getSequencesByUser: builder.query<
      PaginatedSequencesResponse,
      (PaginationParams & { userId?: string }) | void
    >({
      query: ({ userId, page = 1, limit = 12 } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (userId) {
          params.set("id", userId);
        }

        return `sequence/fetch?${params.toString()}`;
      },
    }),
    getStudioSequences: builder.query<
      PaginatedSequencesResponse,
      PaginationParams
    >({
      query: ({ page = 1, limit = 12 } = {}) =>
        `sequence/studio?page=${page}&limit=${limit}`,
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
  useGetSequenceByIdQuery,
  useDeleteSequenceMutation,
  useGetStudioSequencesQuery,
  useLazyGetSequencesByUserQuery,
  useLazyGetStudioSequencesQuery,
} = sequenceApi;
