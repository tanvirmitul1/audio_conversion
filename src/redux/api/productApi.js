import { apiSlice } from "./apiSlice";

const ProductsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProductsList: build.query({
      query: () => `/products`,
    }),
  }),
});

export const { useGetProductsListQuery } = ProductsApiSlice;
