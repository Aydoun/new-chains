import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaginationParams,
  Sequence,
  SequenceNotification,
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

type FollowResponse = {
  followerCount: number;
  isFollower: boolean;
  isMuted: boolean;
};

export const sequenceApi = createApi({
  reducerPath: "sequenceApi",
  tagTypes: ["StudioSequences", "SequenceFollowers", "SequenceNotifications"],
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
      } = {}) => {
        const params = getQueryParams({ page, limit, timeFilter, search });

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
      providesTags: (_result, _error) => [
        { type: "StudioSequences", id: "LIST" },
      ],
    }),
    getSequenceById: builder.query<SingleSequence, number | string>({
      query: (sequenceId) => `sequence/${sequenceId}`,
      providesTags: (_result, _error, sequenceId) => [
        { type: "SequenceFollowers", id: sequenceId },
      ],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SequenceFollowers", id },
        { type: "SequenceNotifications", id: "LIST" },
      ],
    }),
    followSequence: builder.mutation<
      FollowResponse,
      { sequenceId: number | string; action: "follow" | "unfollow" }
    >({
      query: ({ sequenceId, action }) => ({
        url: "sequence/follow",
        method: "POST",
        body: { sequenceId, action },
      }),
      invalidatesTags: (_result, _error, { sequenceId }) => [
        { type: "SequenceFollowers", id: sequenceId },
      ],
    }),
    muteSequence: builder.mutation<
      FollowResponse,
      { sequenceId: number | string; muted: boolean }
    >({
      query: ({ sequenceId, muted }) => ({
        url: "sequence/mute",
        method: "POST",
        body: { sequenceId, muted },
      }),
      invalidatesTags: (_result, _error, { sequenceId }) => [
        { type: "SequenceFollowers", id: sequenceId },
      ],
    }),
    getSequenceNotifications: builder.query<
      SequenceNotification[],
      { sequenceId?: number | string } | void
    >({
      query: (params) => {
        const search = params?.sequenceId
          ? `?sequenceId=${params.sequenceId}`
          : "";
        return `sequence/notifications${search}`;
      },
      providesTags: () => [{ type: "SequenceNotifications", id: "LIST" }],
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
  useFollowSequenceMutation,
  useMuteSequenceMutation,
  useGetSequenceNotificationsQuery,
} = sequenceApi;
