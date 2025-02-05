"use client";
import Posts from "@/components/post/Posts";
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { useUser } from "@/context/UserProvider";

export default function Home() {
  const { user } = useUser();
  console.log("!user", !user);

  return (
    <>
      <Navbar />
      <div className="h-screen grid md:grid-cols-12  ">
        {user && (
          <div className="hidden md:block  md:col-span-3  ">
            <SidebarMenu />
          </div>
        )}

        <div
          className={` text-center   overflow-y-auto ${
            !user ? "col-span-full" : "md:col-span-6"
          } `}
        >
          <Posts />
        </div>

        {user && <div className="hidden  md:block  md:col-span-3 ">Part 3</div>}
      </div>
    </>
  );
}
