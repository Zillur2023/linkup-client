import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReactionsState {
  likes: Record<string, string[]>; // postId -> array of userIds
  dislikes: Record<string, string[]>; // postId -> array of userIds
}

const initialState: ReactionsState = {
  likes: {},
  dislikes: {},
};

const reactionSlice = createSlice({
  name: "reactions",
  initialState,
  reducers: {
    setReactions: (
      state,
      action: PayloadAction<{
        postId: string;
        likes: string[];
        dislikes: string[];
      }>
    ) => {
      const { postId, likes, dislikes } = action.payload;
      state.likes[postId] = likes;
      state.dislikes[postId] = dislikes;
    },

    handleLike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;

      if (!state.likes[postId]) state.likes[postId] = [];
      if (!state.dislikes[postId]) state.dislikes[postId] = [];

      const isLiked = state.likes[postId].includes(userId);
      const isDisliked = state.dislikes[postId].includes(userId);

      if (isDisliked) {
        state.dislikes[postId] = state.dislikes[postId].filter(
          (id) => id !== userId
        );
      } else {
        state.likes[postId].push(userId);
      }

      if (isLiked) {
        state.likes[postId] = state.likes[postId].filter((id) => id !== userId);
      }
    },

    handleDislike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;

      if (!state.likes[postId]) state.likes[postId] = [];
      if (!state.dislikes[postId]) state.dislikes[postId] = [];

      const isLiked = state.likes[postId].includes(userId);
      const isDisliked = state.dislikes[postId].includes(userId);

      if (isLiked) {
        state.likes[postId] = state.likes[postId].filter((id) => id !== userId);
      } else {
        state.dislikes[postId].push(userId);
      }

      if (isDisliked) {
        state.dislikes[postId] = state.dislikes[postId].filter(
          (id) => id !== userId
        );
      }
    },
  },
});

export const { setReactions, handleLike, handleDislike } =
  reactionSlice.actions;
export default reactionSlice.reducer;
