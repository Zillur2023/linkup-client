"use client";
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { useUser } from "@/context/UserProvider";
import { ReactNode } from "react";
// import dynamic from "next/dynamic";

// const Navbar = dynamic(() => import("../../../components/shared/Navbar"), { ssr: false })

export default function layout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <div className="h-screen grid md:grid-cols-12  ">
        {user && (
          <div className="hidden md:block  md:col-span-3  ">
            <SidebarMenu />
          </div>
        )}

        <div className=" text-center md:col-span-6 col-span-full overflow-y-auto ">
          {children}
        </div>

        {user && <div className="hidden  md:block  md:col-span-3 ">Part 3</div>}
      </div>
    </>
  );
}
