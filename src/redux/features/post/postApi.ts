import { IPostApiResponse } from "@/type";
import { baseApi } from "../../api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/post/create",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),

    getAllPost: builder.query<
      IPostApiResponse,
      {
        postId?: string;
        userId?: string;
        searchQuery?: string;
        sortBy?:
          | "highestUpvotes"
          | "lowestUpvotes"
          | "highestDownvotes"
          | "lowestDownvotes";
        isPremium?: boolean;
      }
    >({
      query: ({ postId, userId, searchQuery, sortBy, isPremium }) => {
        const params = new URLSearchParams();

        if (postId) params.append("postId", postId);
        if (userId) params.append("userId", userId);
        if (searchQuery) params.append("searchQuery", searchQuery);
        if (sortBy) params.append("sortBy", sortBy);
        if (isPremium !== undefined) {
          params.append("isPremium", isPremium.toString());
        }

        const url = `/post/all-post${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        return { url, method: "GET" };
      },
      providesTags: ["User", "Post", "Comment", "Chat"],
    }),
    updateLikes: builder.mutation({
      query: (postData) => ({
        url: `/post/likes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    updateDislikes: builder.mutation({
      query: (postData) => ({
        url: `/post/dislikes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    updatePost: builder.mutation({
      query: (postData) => ({
        url: `/post/update`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/delete/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Post", "Comment", "Chat"],
    }),
    isAvailableForVeried: builder.query({
      query: (id) => ({
        url: `/post/isAvailable-verified/${id}`,
        method: "GET",
      }),
      providesTags: ["User", "Post", "Comment", "Chat"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useUpdateLikesMutation,
  useUpdateDislikesMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useIsAvailableForVeriedQuery,
} = postApi;
