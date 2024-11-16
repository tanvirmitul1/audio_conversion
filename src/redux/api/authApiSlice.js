import { setCredentials } from "../features/authSlice";
import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch (err) {
          console.error(err);
        }
      },
    }),
    register: builder.mutation({
      query: (userDetails) => ({
        url: "/register",
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
