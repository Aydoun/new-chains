"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `user/read?id=${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
