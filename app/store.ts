import { configureStore } from "@reduxjs/toolkit";
import { collectionApi } from "./services/collections";
import { frameApi } from "./services/frames";
import { userApi } from "./services/users";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [frameApi.reducerPath]: frameApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      collectionApi.middleware,
      frameApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
