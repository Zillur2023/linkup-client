import Marketplace from "@/components/shared/Marketplace";
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";
import React from "react";

const page = () => {
  // return <Marketplace />;
  return (
    <div>
      <Navbar />
      <div className=" flex ">
        <div className={`hidden md:block  md:w-[20%]`}>
          <SidebarMenu />
        </div>

        <div className={`hidden md:block  md:w-[80%]`}>
          <Marketplace />
        </div>
      </div>
    </div>
  );
};

export default page;
