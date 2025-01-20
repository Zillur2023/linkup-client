import { baseApi } from "../../api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/post/create",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post","User","Comment"],
    }),
    getAllPost: builder.query({
      query: ({
        postId,
        userId,
        searchTerm, 
        category,   
        sortBy, 
        isPremium    
      }: {
        postId?: string;
        userId?: string;
        searchTerm?: string; // Optional searchTerm
        category?: string;   // Optional category
        // sortBy?: "highestUpvotes" | "lowestUpvotes" | "highestDownvotes" | "lowestDownvotes" 
        sortBy?: string; 
        isPremium?: boolean; 
      }) => {
        let url = '/post/all-post'; // Base URL
    
        // Append postId and userId as path parameters
        if (postId) {
          url += `/${postId}`;
        }
        
        if (userId) {
          url += `/${userId}`;
        }
    
        // Append searchTerm and sortBy as query parameters
        const params: string[] = [];
        if (searchTerm) {
          params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        }
        if (category) {
          params.push(`category=${encodeURIComponent(category)}`); // Append category
        }
        if (sortBy) {
          params.push(`sortBy=${sortBy}`);
        }
        if (isPremium !== undefined) {
          params.push(`isPremium=${isPremium}`);
        }
        
        // If there are any query parameters, append them to the URL
        if (params.length) {
          url += `?${params.join('&')}`;
        }
        
    
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Post"],
    }),
    
    updateUpvote: builder.mutation({
      query: (postData) => ({
        url: `/post/upvotes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post","User"],
    }),
    updateDownvote: builder.mutation({
      query: (postData) => ({
        url: `/post/downvotes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post","User"],
    }),
    updatePost: builder.mutation({
      query: (postData) => ({
        url: `/post/update`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post","User"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/delete/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post","User"],
    }),
    isAvailableForVeried: builder.query({
      query: (id) => ({
        url: `/post/isAvailable-verified/${id}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useUpdateUpvoteMutation,
  useUpdateDownvoteMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useIsAvailableForVeriedQuery
} = postApi;


// getAllPost: builder.query({
//   query: ({ postId, userId }: { postId?: string; userId?: string }) => {
//     let url = '/post/all-post'; // Base URL
//     if (postId) {
//       // If postId is provided, append it to the URL
//       url += `/${postId}`;
//     } else if (userId) {
//       // If userId is provided, append it to the URL
//       url += `/userId/${userId}`;
//     }

//     return {
//       url,
//       method: "GET",
//     };
//   },
//   providesTags: ["Post"],
// }),
