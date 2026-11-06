import type { User } from "../types";
import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation<User, { id: string | undefined; bio: string }>({
      query: ({ id, bio }) => ({
        url: `user/update?id=${id}`,
        method: "PUT",
        body: { bio },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = userApi;
