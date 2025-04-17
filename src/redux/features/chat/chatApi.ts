import { IChatApiResponse } from "@/type";
import { baseApi } from "../../api/baseApi";

interface ChatParams {
  senderId: string;
  receiverId?: string;
}

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
      query: ({ senderId, receiverId }) => ({
        url: `/chat/getChatbyUserId`,
        method: "GET",
        params: {
          senderId, // Always included (required)
          ...(receiverId && { receiverId }), // Only included if defined
        },
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const { useCreateChatMutation, useGetChatbyUserIdQuery } = authApi;
