
import { baseApi } from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (userInfo) => ({
          url: '/auth/login',
          method: 'POST',
          body: userInfo,
        }),
      }),
      forgetPassword: builder.mutation({
        query: (formData) => ({
          url: '/auth/forget-password',
          method: 'POST',
          body: formData,
        }),
      }),
      resetPassword: builder.mutation({
        query: (formData) => ({
          url: '/auth/reset-password',
          method: 'POST',
          body: formData,
        }),
      }),
      changePassword: builder.mutation({
        query: (formData) => ({
          url: '/auth/change-password',
          method: 'POST',
          body: formData,
        }),
      }),
    }),
  });
  
  export const { useLoginMutation, useForgetPasswordMutation, useResetPasswordMutation, useChangePasswordMutation } = authApi;
