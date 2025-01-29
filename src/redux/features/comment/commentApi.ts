
import { baseApi } from "../../api/baseApi";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createComment: builder.mutation({
        query: (commentData) => ({
          url: '/comment/create',
          method: 'POST',
          body: commentData,
        }),
        invalidatesTags: ["Comment","Post","User"]
      }),
      getAllComment: builder.query({
        query: (postId) => ({
          url: `/comment/all-comment/${postId}`,
          method: 'GET',
        }),
        providesTags: ["Comment","Post","User"]
      }),
      deleteComment: builder.mutation({
        query: (commentId) => ({
          url: `/comment/delete/${commentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ["Comment","Post","User"]
      }),
    }),
  });
  
  export const { useCreateCommentMutation, useGetAllCommentQuery, useDeleteCommentMutation } = authApi;