import { getAccessToken, logout, setAccessToken } from "@/service/AuthService";
import {
    BaseQueryApi,
    BaseQueryFn,
    createApi,
    DefinitionType,
    FetchArgs,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
  
  const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  
    
    credentials: "include",
    prepareHeaders: async(headers) => {
     try {
      const accessToken = await  getAccessToken()
  
  
      if (accessToken) {
        headers.set("authorization", `${accessToken}`);
      }
     } catch (error:any) {
      console.log({error})
     }
  
      return headers;
    },
  });
  
  // console.log("process.env.SERVER_URL",process.env.NEXT_PUBLIC_SERVER_URL)
  
  const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    BaseQueryApi,
    DefinitionType
  > = async (args, api, extraOptions): Promise<any> => {
    let result: any = await baseQuery(args, api, extraOptions);
  
    // if (result?.error?.data?.err?.statusCode === 401) {
    // if (result?.error?.status === 404) {
    //   toast.error('User not found')
    // }
    // if (result?.error?.status === 403) {
    //   toast.error('Password not match')
    // }
   
    console.log('result?.error?.status === 401',result?.error?.status === 401)
  
    if (result?.error?.status === 401) {
      //* Send Refresh
      console.log("Sending refresh token");
  
      try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
  
      const data = await res.json();
  
      const accessToken = data?.data?.accessToken
  
      console.log('baseApi res', accessToken)
  
      await setAccessToken(accessToken)
  
  
      if (res.ok) {
        // If the refresh was successful, proceed with baseQuery
         result = await baseQuery(args, api, extraOptions);
    } else {
          // If the refresh failed, log the user out
          await logout();
        }
      // await logout();
      //      result = await baseQuery(args, api, extraOptions);
  } catch (error) {
    console.error("Network or fetch error:", error);
    // Handle network or fetch errors here, possibly log out as well
    await logout();
  }
  
     
     
      
    }
  
    return result;
  };
  
  export const baseApi = createApi({
    reducerPath: "baseApi",
    tagTypes: ["User", "Post", "Comment"],
    baseQuery: baseQueryWithRefreshToken,
    // baseQuery,
    endpoints: () => ({}),
  });
  