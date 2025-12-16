"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Collection, CreateCollectionRequest } from "../types";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`;

export const collectionApi = createApi({
  reducerPath: "collectionApi",
  tagTypes: ["Collections"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCollectionsByUser: builder.query<Collection[], string>({
      query: (userId) => `collection/read?id=${userId}`,
      providesTags: ["Collections"],
    }),
    createCollectionFromFrameIds: builder.mutation<
      Collection,
      CreateCollectionRequest
    >({
      query: ({ title, description = "", url = "", userId, frameIds }) => ({
        url: "collection/create",
        method: "POST",
        body: {
          title,
          description,
          url,
          userId,
          frameOrder: frameIds,
        },
      }),
      invalidatesTags: ["Collections"],
    }),
  }),
});

export const {
  useGetCollectionsByUserQuery,
  useCreateCollectionFromFrameIdsMutation,
} = collectionApi;
