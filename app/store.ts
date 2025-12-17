import { configureStore } from "@reduxjs/toolkit";
import { sequenceApi } from "./services/sequences";
import { userApi } from "./services/users";
import { frameApi } from "./services/frames";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [sequenceApi.reducerPath]: sequenceApi.reducer,
    [frameApi.reducerPath]: frameApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      sequenceApi.middleware,
      frameApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
