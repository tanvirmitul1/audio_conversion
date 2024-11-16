import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

import { apiSlice } from "./api/apiSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    product: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
