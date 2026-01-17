import { configureStore } from "@reduxjs/toolkit";
import { sequenceApi } from "./services/sequences";
import { userApi } from "./services/users";
import { frameApi } from "./services/frames";
import { snippetsApi } from "./services/snippets";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [sequenceApi.reducerPath]: sequenceApi.reducer,
    [frameApi.reducerPath]: frameApi.reducer,
    [snippetsApi.reducerPath]: snippetsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      sequenceApi.middleware,
      frameApi.middleware,
      snippetsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
