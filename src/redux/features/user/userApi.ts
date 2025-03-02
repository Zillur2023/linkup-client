import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userInfo) => ({
        url: "user/create",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: `/user/all-user`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserByEmail: builder.query({
      query: (email) => ({
        url: `/user/${email}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id:any) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: `/user/update`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User", "Post"],
    }),
    updateFollowUnfollow: builder.mutation({
      query: (data) => ({
        url: `user/update-follow-unfollow/${data.targetId}`,
        method: "PUT",
        body: { _id: data?.loginUserId },
      }),
      invalidatesTags: ["User"],
    }),

    updateVerified: builder.mutation({
      query: (id) => ({
        url: `/user/update-verified/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useGetUserByEmailQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateFollowUnfollowMutation,
  useUpdateVerifiedMutation,
  useDeleteUserMutation,
} = userApi;
