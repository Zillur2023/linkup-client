"use client";

import UserProvider from "@/context/UserProvider";
import { persistor, store } from "@/redux/store";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserProvider>
        <PersistGate loading={null} persistor={persistor}>
          <HeroUIProvider>
            <Toaster position="top-center" richColors />
            {children}
          </HeroUIProvider>
        </PersistGate>
      </UserProvider>
    </Provider>
  );
}
