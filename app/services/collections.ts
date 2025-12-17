"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Collection } from "../types";

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
    createCollection: builder.mutation<Collection, CollectionInput>({
      query: (input) => ({
        url: "collection/create",
        method: "POST",
        body: input,
      }),
    }),
  }),
});

export const { useGetCollectionsByUserQuery, useCreateCollectionMutation } =
  collectionApi;
