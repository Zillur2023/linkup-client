import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (chatData) => ({
        url: "/chat/createChat",
        method: "POST",
        body: chatData,
      }),
      invalidatesTags: ["Comment", "Post", "User", "Chat"],
    }),
  }),
});

export const { useCreateChatMutation } = authApi;
