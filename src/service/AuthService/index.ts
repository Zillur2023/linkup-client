"use server";
import { DecodedUser } from "@/context/UserProvider";
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
  const token = (await cookies()).get("accessToken")?.value;

  let decodedToken: DecodedUser | null = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  return decodedToken;
};

// export const logout = async () => {
//   (await cookies()).delete("accessToken");
//   (await cookies()).delete("refreshToken");
// };
export const logout = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};

export const getAccessToken = async () => {
  const result = (await cookies()).get("accessToken")?.value;

  return result;
};
