import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type DecodedAccessToken = {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: DecodedAccessToken | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      console.log("action?.payload", action?.payload);
      const { accessToken, refreshToken } = action.payload;

      const decoded = jwtDecode<DecodedAccessToken>(accessToken);
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = decoded;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setUpdateAccessToken: (state, action: PayloadAction<string>) => {
      const decoded = jwtDecode<DecodedAccessToken>(action.payload);
      state.accessToken = action.payload;
      state.user = decoded;
    },
  },
});

export const { setToken, logout, setUpdateAccessToken } = authSlice.actions;
export default authSlice.reducer;
