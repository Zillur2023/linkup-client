'use client'

import UserProvider from "@/context/UserProvider";
import { store } from "@/redux/store";
import {HeroUIProvider} from "@heroui/react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <UserProvider>
    <Provider store={store}>
    <HeroUIProvider>
    <Toaster position="top-center" richColors />
      {children}
    </HeroUIProvider>
    </Provider>
    </UserProvider>
  )
}