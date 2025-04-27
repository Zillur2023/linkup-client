import { IChatApiResponse } from "@/type";
import { baseApi } from "../../api/baseApi";

export type ChatParams = {
  senderId: string;
  receiverId?: string;
  skip?: number;
  limit?: number;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (chatData) => ({
        url: "/chat/createChat",
        method: "POST",
        body: chatData,
      }),
      // invalidatesTags: ["Chat"],
    }),
    getChatbyUserId: builder.query<IChatApiResponse, ChatParams>({
      query: ({ senderId, receiverId, skip = 0, limit = 10 }) => ({
        url: "/chat/getChatbyUserId",
        method: "GET",
        params: {
          senderId,
          ...(receiverId && { receiverId }),
          skip,
          limit,
        },
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const { useCreateChatMutation, useGetChatbyUserIdQuery } = authApi;
