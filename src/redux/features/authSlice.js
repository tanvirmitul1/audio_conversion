import { createSlice } from "@reduxjs/toolkit";

// Helper function to get credentials from localStorage
const getStoredCredentials = () => {
  const credentials = localStorage.getItem("auth");
  return credentials ? JSON.parse(credentials) : null;
};

const storedCredentials = getStoredCredentials();
const isAuthenticated =
  storedCredentials && storedCredentials.access ? true : false;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    access: storedCredentials?.access || null,
    refresh: storedCredentials?.refresh || null,
    user: storedCredentials?.user || null,
    isAuthenticated: isAuthenticated,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { access, refresh, user } = action.payload;
      state.access = access;
      state.refresh = refresh;
      state.user = user;
      state.isAuthenticated = !!access;

      // Persist credentials in localStorage
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;
      state.isAuthenticated = false;

      // Remove credentials from localStorage
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
