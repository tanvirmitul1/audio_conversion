import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiBaseUrl = "http://localhost:5000/api";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.access;
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  keepUnusedDataFor: 60,
  tagTypes: [],
  endpoints: () => ({}),
});
