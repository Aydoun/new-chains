import type {
  PaginationParams,
  Sequence,
  SingleSequence,
  Visibility,
} from "@/app/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getQueryParams } from "@/lib/utils";
import { api } from "./api";

export type FrameInput = {
  content: string;
  description?: string;
  assetId?: number;
  linkUrl?: string;
};

/** Frames are created together with their sequence, in one request. */
export type SequenceInput = {
  title: string;
  description?: string;
  visibility?: Visibility;
  frames: FrameInput[];
};

export type SequenceUpdateInput = {
  title?: string;
  description?: string;
  visibility?: Sequence["visibility"];
};

export type PaginatedSequencesResponse = {
  items: Sequence[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextPage: number | null;
};

export const sequenceApi = api.injectEndpoints({
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
      } = {}) => {
        const params = getQueryParams({ page, limit, timeFilter, search });

        return `sequence/fetch?${params}`;
      },
    }),
    getStudioSequences: builder.query<
      PaginatedSequencesResponse,
      PaginationParams
    >({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_SIZE,
        userId,
        timeFilter,
        search,
      } = {}) => {
        const params = getQueryParams({
          page,
          userId,
          limit,
          timeFilter,
          search,
        });

        return `sequence/studio?${params}`;
      },
      providesTags: () => [{ type: "StudioSequences", id: "LIST" }],
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
} = sequenceApi;
