import type { CommentsPage, SequenceComment } from "@/app/types";
import { api } from "./api";

export type CreateCommentInput = { sequenceId: number; content: string };
export type DeleteCommentInput = { id: number; sequenceId: number };

export const commentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** A sequence's comments, newest first, one cursor page at a time. */
    getComments: builder.infiniteQuery<CommentsPage, number, number | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg: sequenceId, pageParam }) => {
        const params = new URLSearchParams({ sequenceId: `${sequenceId}` });
        if (pageParam) params.set("cursor", `${pageParam}`);
        return `comment/list?${params}`;
      },
    }),
    createComment: builder.mutation<SequenceComment, CreateCommentInput>({
      query: (body) => ({ url: "comment/create", method: "POST", body }),
      // Show the new comment on top without refetching every loaded page.
      async onQueryStarted({ sequenceId }, { dispatch, queryFulfilled }) {
        const { data: comment } = await queryFulfilled.catch(() => ({ data: null }));
        if (!comment) return;
        dispatch(
          commentsApi.util.updateQueryData("getComments", sequenceId, (draft) => {
            const [first] = draft.pages;
            if (!first) return;
            first.items.unshift(comment);
            first.total += 1;
          }),
        );
      },
    }),
    deleteComment: builder.mutation<{ message: string }, DeleteCommentInput>({
      query: ({ id }) => ({ url: `comment/delete?id=${id}`, method: "DELETE" }),
      async onQueryStarted({ id, sequenceId }, { dispatch, queryFulfilled }) {
        const ok = await queryFulfilled.then(() => true).catch(() => false);
        if (!ok) return;
        dispatch(
          commentsApi.util.updateQueryData("getComments", sequenceId, (draft) => {
            for (const page of draft.pages) {
              page.items = page.items.filter((comment) => comment.id !== id);
            }
            if (draft.pages[0]) draft.pages[0].total -= 1;
          }),
        );
      },
    }),
  }),
});

export const {
  useGetCommentsInfiniteQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
