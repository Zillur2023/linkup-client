"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const setToken = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
    (await cookies()).set("accessToken", accessToken);
  (await cookies()).set("refreshToken", refreshToken);
};

export const getUser = async () => {
  const token =   (await cookies()).get("accessToken")?.value;

  console.log("get accessToken from cookies ", token);

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
export const setAccessToken = async (token: string) => {
  const result =  (await cookies()).set("accessToken", token);

  return result;
};
