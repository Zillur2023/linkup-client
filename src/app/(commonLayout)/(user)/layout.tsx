import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar/>
      <div className="h-screen grid md:grid-cols-8">
    
    <div className="hidden md:block  md:col-span-2">
    <SidebarMenu/>
    </div>
  
    <div className=" text-center md:col-span-4 col-span-full ">
      {children}
    </div>
  
    <div className="hidden  md:block  md:col-span-2">
    Part 3
    </div>
  </div>
    </div>
  );
}