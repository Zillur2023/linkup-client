import Posts from "@/components/post/Posts";
import SidebarMenu from "@/components/shared/SidebarMenu";

export default function Home() {
  return (
    <div className=" flex ">
      <div className="hidden lg:block  lg:w-[20%] fixed h-screen overflow-y-auto ">
        <SidebarMenu />
      </div>

      <div className=" lg:block  lg:w-[60%] lg:ml-[20%] mx-auto md:w-[80%]  ">
        <Posts />
      </div>

      <div className="hidden lg:block  lg:w-[20%]  fixed right-0  overflow-y-auto h-screen ">
        Part 3
      </div>
    </div>
  );
}
