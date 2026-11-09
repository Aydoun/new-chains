import type { UploadedAsset } from "@/app/types";
import { api } from "./api";

export const assetApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useUploadImageMutation } = assetApi;
