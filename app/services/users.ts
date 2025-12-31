import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../types";

const API_BASE_URL = `/api/`;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `user/${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
