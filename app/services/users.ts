"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/` }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string | void>({
      query: () => `user/read?id=1`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
