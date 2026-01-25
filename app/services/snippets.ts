import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import { Snippet } from "@/app/types";

export type CreateSnippetInput = {
  frameId: number;
  originSequenceId: number;
  // type: Snippet["type"];
  // notes?: string;
};

export const snippetsApi = createApi({
  reducerPath: "snippetsApi",
  tagTypes: ["Snippets"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    getSnippets: builder.query<Snippet[], void>({
      query: () => "snippet/list",
      providesTags: [{ type: "Snippets", id: "LIST" }],
    }),
    saveSnippet: builder.mutation<Snippet, CreateSnippetInput>({
      query: (body) => ({
        url: "snippet/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Snippets", id: "LIST" }],
    }),
    deleteSnippet: builder.mutation<{ message: string }, number | string>({
      query: (id) => ({
        url: `snippet/delete?id=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSnippetsQuery,
  useSaveSnippetMutation,
  useLazyGetSnippetsQuery,
  useDeleteSnippetMutation,
} = snippetsApi;
