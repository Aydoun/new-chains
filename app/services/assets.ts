import type { LibraryAsset, UploadedAsset } from "@/app/types";
import type { PaginatedResult } from "@/hooks/useInfinitePagination";
import { api } from "./api";

export const assetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** A page of the user's uploaded images, for the assets folder. */
    getAssets: builder.query<
      PaginatedResult<LibraryAsset>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `asset/list?page=${page}&limit=${limit}`,
    }),
    /** Sends the file as the raw body; the server validates and stores it. */
    uploadImage: builder.mutation<UploadedAsset, File>({
      query: (file) => ({
        url: "asset/upload",
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type },
      }),
    }),
  }),
});

export const { useUploadImageMutation, useLazyGetAssetsQuery } = assetApi;
