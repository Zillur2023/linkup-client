import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "/comment/create",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    getAllComment: builder.query({
      query: (postId) => ({
        url: `/comment/all-comment/${postId}`,
        method: "GET",
      }),
      providesTags: ["User", "Post", "Comment", "Chat"],
    }),
    updateComment: builder.mutation({
      query: (comment) => ({
        url: `/comment/update`,
        method: "PUT",
        body: comment,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/delete/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetAllCommentQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = authApi;
