import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/constants";
import type { User } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string | number>({
      query: (id) => `user/${id}`,
    }),
    updateUser: builder.mutation<
      User,
      Partial<Omit<User, "id">> & { id: string | number }
    >({
      query: ({ id, ...updates }) => ({
        url: `user/update?id=${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = userApi;
