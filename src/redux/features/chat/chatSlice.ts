// redux/features/chat/chatSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IMessage } from "@/type";
import { RootState } from "@/redux/store"; // Adjust the import path as necessary

// type ChatState = {
//   chats: {
//     [key: string]: IChat;
//   };
// };
// const initialState: ChatState = {
//   chats: {},
// };
interface ChatState {
  chats: Record<string, IChat>;
  hasMoreMessages: Record<string, boolean>;
  skipCounts: Record<string, number>;
  drawerStatus: Record<string, boolean>;
}

const initialState: ChatState = {
  chats: {},
  hasMoreMessages: {},
  skipCounts: {},
  drawerStatus: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<{ key: string; chat: IChat }>) => {
      state.chats[action.payload.key] = action.payload.chat;
    },
    prependMessages: (
      state,
      action: PayloadAction<{ key: string; messages: IMessage[] }>
    ) => {
      //   const chat = state.chats[action.payload.key];
      //   if (chat) {
      //     chat.messages = [...action.payload.messages, ...chat.messages];
      //   }
      const { key, messages } = action.payload;
      const chat = state.chats[key];

      if (chat) {
        const existingIds = new Set(chat.messages.map((m) => m._id));
        const uniqueMessages = messages.filter(
          (message) => !existingIds.has(message._id)
        );

        chat.messages = [...uniqueMessages, ...chat.messages];
      }
    },
    appendMessage: (
      state,
      action: PayloadAction<{ key: string; message: IMessage }>
    ) => {
      //   const chat = state.chats[action.payload.key];
      //   if (chat) {
      //     chat.messages.push(action.payload.message);
      //   }
      const { key, message } = action.payload;
      const chat = state.chats[key];

      if (chat) {
        const messageExists = chat.messages.some((m) => m._id === message._id);
        if (!messageExists) {
          chat.messages.push(message);
        }
      }
    },

    setHasMoreMessages: (
      state,
      action: PayloadAction<{ key: string; hasMore: boolean }>
    ) => {
      const { key, hasMore } = action.payload;
      state.hasMoreMessages[key] = hasMore;
    },

    setSkipCount: (
      state,
      action: PayloadAction<{ key: string; skip: number }>
    ) => {
      const { key, skip } = action.payload;
      state.skipCounts[key] = skip;
    },
    incrementSkipCount: (
      state,
      action: PayloadAction<{ key: string; amount: number }>
    ) => {
      const { key, amount } = action.payload;
      state.skipCounts[key] = (state.skipCounts[key] || 0) + amount;
    },
    setDrawerStatus: (
      state,
      action: PayloadAction<{ key: string; status: boolean }>
    ) => {
      // state.drawerStatus[action.payload.key] = action.payload.status;
      const { key, status } = action.payload;

      if (status) {
        // Only store if status is true
        state.drawerStatus[key] = true;
      } else {
        // Remove the key if status is false
        delete state.drawerStatus[key];
      }
      // if (status) {
      //   // When setting a new true status:
      //   // 1. First clear all existing statuses
      //   // 2. Then set the new status
      //   state.drawerStatus = { [key]: true };
      // } else {
      //   // When setting false status:
      //   // 1. Remove the specific key
      //   // 2. If no statuses remain, set default
      //   delete state.drawerStatus[key];
      //   if (Object.keys(state.drawerStatus).length === 0) {
      //     state.drawerStatus = { [DEFAULT_DRAWER_KEY]: true };
      //   }
      // }
    },
  },
});

// Selectors
export const selectChatByKey = (key: string) => (state: RootState) =>
  state.chat.chats[key];

export const selectMessagesByKey = (key: string) => (state: RootState) =>
  state.chat.chats[key]?.messages || [];

export const selectHasMoreMessages = (key: string) => (state: RootState) =>
  state.chat.hasMoreMessages[key] ?? true;

export const selectSkipCount = (key: string) => (state: RootState) =>
  state.chat.skipCounts[key] || 0;

export const selectDrawerStatus = (key: string) => (state: RootState) =>
  state.chat.drawerStatus[key] || false;

export const {
  setChat,
  prependMessages,
  appendMessage,
  setHasMoreMessages,
  setSkipCount,
  incrementSkipCount,
  setDrawerStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
