import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import colorModeReducer from "./features/colorModeSlice";

import { apiSlice } from "./api/apiSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    auth: authReducer,
    colorMode: colorModeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
