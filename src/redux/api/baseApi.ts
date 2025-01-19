import { getAccessToken } from "@/service/AuthService";
import {
    createApi,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
  
  const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:5000/api/v1`,
    credentials: "include",
    prepareHeaders: async(headers) => {
     try {
      const accessToken = await  getAccessToken()

      console.log("baseApi accessTOken", accessToken)
  
  
      if (accessToken) {
        headers.set("authorization", `${accessToken}`);
      }
     } catch (error:any) {
      console.log({error})
     }
  
      return headers;
    },
  });
  
  
  export const baseApi = createApi({
    reducerPath: "baseApi",
    tagTypes: ["User", "Post", "Comment"],
    baseQuery,
    endpoints: () => ({}),
  });
  