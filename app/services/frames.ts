import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/constants";

export type FrameInput = {
  content: string;
  description?: string;
};

export type BulkCreateFramesResponse = {
  ids: number[];
};

export const frameApi = createApi({
  reducerPath: "frameApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
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
