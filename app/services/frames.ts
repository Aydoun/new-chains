"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type FrameInput = {
  content: string;
  description?: string;
};

export type BulkCreateFramesResponse = {
  ids: number[];
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`;

export const frameApi = createApi({
  reducerPath: "frameApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    bulkCreateFrames: builder.mutation<BulkCreateFramesResponse, FrameInput[]>({
      query: (frames) => ({
        url: "frame/bulk-create",
        method: "POST",
        body: { frames },
      }),
    }),
  }),
});

export const { useBulkCreateFramesMutation } = frameApi;
