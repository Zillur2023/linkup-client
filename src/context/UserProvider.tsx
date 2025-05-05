"use client";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { createContext, ReactNode, useContext, useState } from "react";

export type DecodedUser = {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

interface IUserProviderValues {
  user: DecodedUser | null;
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }

  return context;
};

export default UserProvider;
