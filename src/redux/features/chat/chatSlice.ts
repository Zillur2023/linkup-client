// redux/features/chat/chatSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IMessage } from "@/type";
import { RootState } from "@/redux/store"; // Adjust the import path as necessary

type ChatState = {
  chats: {
    [key: string]: IChat;
  };
};

const initialState: ChatState = {
  chats: {},
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
  },
});

// Selectors
export const selectChatByKey = (key: string) => (state: RootState) =>
  state.chat.chats[key];

export const selectMessagesByKey = (key: string) => (state: RootState) =>
  state.chat.chats[key]?.messages || [];

export const { setChat, prependMessages, appendMessage } = chatSlice.actions;

export default chatSlice.reducer;
