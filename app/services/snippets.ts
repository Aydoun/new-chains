import type { Snippet } from "@/app/types";
import { api } from "./api";

export type CreateSnippetInput = {
  frameId: number;
  originSequenceId: number;
};

export const snippetsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSnippets: builder.query<Snippet[], void>({
      query: () => "snippet/list",
      providesTags: [{ type: "Snippets", id: "LIST" }],
    }),
    saveSnippet: builder.mutation<Snippet, CreateSnippetInput>({
      query: (body) => ({ url: "snippet/create", method: "POST", body }),
      invalidatesTags: [{ type: "Snippets", id: "LIST" }],
    }),
    deleteSnippet: builder.mutation<{ message: string }, number | string>({
      query: (id) => ({ url: `snippet/delete?id=${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Snippets", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSnippetsQuery,
  useSaveSnippetMutation,
  useLazyGetSnippetsQuery,
  useDeleteSnippetMutation,
} = snippetsApi;
