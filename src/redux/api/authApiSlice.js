import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userDetails) => ({
        url: "/auth/register",
        method: "POST",
        body: userDetails,
      }),
    }),
    fetchUser: builder.query({
      query: () => "/me",
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useFetchUserQuery } =
  authApiSlice;
