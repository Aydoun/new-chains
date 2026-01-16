import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaginationParams,
  Sequence,
  SingleSequence,
  TimeFilter,
} from "@/app/types";
import { API_BASE_URL, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getQueryParams } from "@/lib/utils";

export type BulkCreateFramesResponse = {
  ids: number[];
};

export type SequenceInput = {
  frameOrder: number[];
  title: string;
  userId: string;
  description?: string;
  status?: Sequence["status"];
};

export type SequenceUpdateInput = {
  title?: string;
  description?: string;
  visibility?: Sequence["visibility"];
  status?: Sequence["status"];
};

export type PaginatedSequencesResponse = {
  items: Sequence[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextPage: number | null;
};

export const sequenceApi = createApi({
  reducerPath: "sequenceApi",
  tagTypes: ["StudioSequences"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    getSequencesByUser: builder.query<
      PaginatedSequencesResponse,
      PaginationParams | void
    >({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_SIZE,
        timeFilter,
        search,
        statuses,
      } = {}) => {
        const params = getQueryParams({
          page,
          limit,
          timeFilter,
          search,
          statuses,
        });

        return `sequence/fetch?${params}`;
      },
    }),
    getStudioSequences: builder.query<
      PaginatedSequencesResponse,
      PaginationParams & { timeFilter?: TimeFilter }
    >({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_SIZE,
        userId,
        timeFilter,
        search,
        statuses,
      } = {}) => {
        const params = getQueryParams({
          page,
          userId,
          limit,
          timeFilter,
          search,
          statuses,
        });

        return `sequence/studio?${params}`;
      },
      providesTags: (_result, _error, { timeFilter, userId } = {}) => [
        { type: "StudioSequences", id: "LIST" },
      ],
    }),
    getSequenceById: builder.query<SingleSequence, number | string>({
      query: (sequenceId) => `sequence/${sequenceId}`,
    }),
    createSequence: builder.mutation<Sequence, SequenceInput>({
      query: (input) => ({
        url: "sequence/create",
        method: "POST",
        body: input,
      }),
      invalidatesTags: [{ type: "StudioSequences", id: "LIST" }],
    }),
    deleteSequence: builder.mutation<{ message: string }, number | string>({
      query: (sequenceId) => ({
        url: `sequence/delete?id=${sequenceId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "StudioSequences", id: "LIST" }],
    }),
    updateSequence: builder.mutation<
      Sequence,
      { id: number | string; updates: SequenceUpdateInput }
    >({
      query: ({ id, updates }) => ({
        url: `sequence/update?id=${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: [{ type: "StudioSequences", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSequencesByUserQuery,
  useCreateSequenceMutation,
  useLazyGetSequenceByIdQuery,
  useGetSequenceByIdQuery,
  useDeleteSequenceMutation,
  useGetStudioSequencesQuery,
  useLazyGetSequencesByUserQuery,
  useLazyGetStudioSequencesQuery,
  useUpdateSequenceMutation,
} = sequenceApi;
