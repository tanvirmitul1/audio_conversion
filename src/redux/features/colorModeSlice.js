// store/colorModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
};

const colorModeSlice = createSlice({
  name: "colorMode",
  initialState,
  reducers: {
    toggleColorMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleColorMode } = colorModeSlice.actions;
export default colorModeSlice.reducer;
