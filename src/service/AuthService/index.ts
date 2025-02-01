"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";



export const getUser = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  let decodedToken = null;

  if (token) {
    decodedToken = await jwtDecode(token);
  }

  return decodedToken;
};

export const logout = async () => {
    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");
};

export const getAccessToken = async () => {
  const result =  (await cookies()).get("accessToken")?.value;

  return result;
};
