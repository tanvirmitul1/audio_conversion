import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;
console.log({ apiBaseUrl });
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
