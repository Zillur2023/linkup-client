'use client'
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { ReactNode } from "react";



export default function layout({ children }: { children: ReactNode }) {

  return (
     <>
     <Navbar/>
      <div className="h-screen grid md:grid-cols-12  ">
    <div className="hidden md:block  md:col-span-3  ">
    <SidebarMenu/>
    </div>
  
    <div className=" text-center md:col-span-6 col-span-full overflow-y-auto " >
      {children}
    </div>
  
    <div className="hidden  md:block  md:col-span-3 ">
    Part 3
    </div>
  </div>
     </>
  
  );
}