import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";

/**
 * The single RTK Query API. Feature files add their endpoints with
 * `api.injectEndpoints`, so they share one cache and invalidation tags.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  tagTypes: ["StudioSequences", "Snippets", "User"],
  endpoints: () => ({}),
});
