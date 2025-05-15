import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setUpdateAccessToken } from "../features/auth/authSlice";
import { RootState, store } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: async (headers) => {
    try {
      const state = store.getState() as RootState;
      const accessToken = state.auth.accessToken;

      // console.log("baseApi accessTOken", accessToken)

      if (accessToken) {
        headers.set("authorization", `${accessToken}`);
      }
    } catch (error: any) {
      console.log({ error });
    }

    return headers;
  },
});

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

  if (result?.error?.status === 401) {
    //* Send Refresh
    console.log("Sending refresh token");
    const state = store.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    console.log({ refreshToken });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", //  Important:  Tell the server you're sending JSON
          },
          body: JSON.stringify({ refreshToken: refreshToken }),
        }
      );

      const data = await res.json();
      console.log({ res });
      console.log({ data });

      const accessToken = data?.data?.accessToken;

      setUpdateAccessToken(accessToken);

      if (res.ok) {
        // If the refresh was successful, proceed with baseQuery
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If the refresh failed, log the user out

        logout();
      }
      // await logout();
      //      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      console.error("Network or fetch error:", error);
      // Handle network or fetch errors here, possibly log out as well
      logout();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Post", "Comment", "Chat"],
  // baseQuery,
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
