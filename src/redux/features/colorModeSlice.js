// store/colorModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storedColorMode = localStorage.getItem("colorMode");
const initialMode = storedColorMode ? storedColorMode : "light";

const initialState = {
  mode: initialMode,
};

const colorModeSlice = createSlice({
  name: "colorMode",
  initialState,
  reducers: {
    toggleColorMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      localStorage.setItem("colorMode", state.mode);
    },
  },
});

export const { toggleColorMode } = colorModeSlice.actions;
export default colorModeSlice.reducer;
