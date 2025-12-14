import { configureStore } from "@reduxjs/toolkit";
import { collectionApi } from "./services/collections";
import { userApi } from "./services/users";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, collectionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
