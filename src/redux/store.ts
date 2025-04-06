import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
// import reactionReducer from "./reactionSlice";
import reactionReducer from "./features/post/reactionSlice";

export const store = configureStore({
  reducer: {
    reactions: reactionReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
