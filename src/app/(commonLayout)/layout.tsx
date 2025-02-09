"use client";
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  // Get the current pathname
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  // Log the pathname
  return (
    <div className=" max-w-7xl mx-auto  ">
      <Navbar />
      <div className=" ">
        <div className="h-screen grid md:grid-cols-12 ">
          {!(pathname === `/${userData?.data?.name}`) && (
            <div className={`hidden md:block  md:col-span-3 `}>
              <SidebarMenu />
            </div>
          )}

          <div
            className={`${
              pathname === "/marketplace" || `${userData?.data?.name}`
                ? "md:col-span-9"
                : "md:col-span-6"
            } text-center  col-span-full overflow-y-auto `}
          >
            {children}
          </div>

          {!(pathname === `/${userData?.data?.name}`) && (
            <div
              className={`${
                pathname === "/marketplace" ? "md:col-span-3" : "md:hidden"
              } hidden  md:block   `}
            >
              Part 3
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
