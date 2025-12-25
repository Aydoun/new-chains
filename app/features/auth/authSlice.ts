import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

export interface AuthState {
  status: AuthStatus;
  user?: AuthUser;
}

const initialState: AuthState = {
  status: "loading",
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ status: AuthStatus; user?: AuthUser }>
    ) => {
      state.status = action.payload.status;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.status = "unauthenticated";
      state.user = undefined;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
