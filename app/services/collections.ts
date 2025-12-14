"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Collection } from "../types";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`;

export const collectionApi = createApi({
  reducerPath: "collectionApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCollectionsByUser: builder.query<Collection[], string>({
      query: (userId) => `collection/read?id=${userId}`,
    }),
  }),
});

export const { useGetCollectionsByUserQuery } = collectionApi;
