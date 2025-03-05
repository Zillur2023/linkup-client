import Posts from "@/components/post/Posts";
import SidebarMenu from "@/components/shared/SidebarMenu";

export default function Home() {
  return (
    <div className=" flex justify-center gap-2 my-5">
      <div className="hidden lg:block  lg:w-[20%] sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto   ">
        <SidebarMenu />
      </div>

      <div className=" lg:block w-full  lg:w-[60%]  mx-auto  ">
        <div className=" lg:block w-full md:w-[60%]  lg:w-[70%]  mx-auto  ">
          <Posts />
        </div>
        {/* <Posts /> */}
      </div>

      <div className="hidden lg:block  lg:w-[20%]  sticky top-[65px] h-[calc(100vh-65px)]  overflow-y-auto   ">
        {/* Part 3 */}
        <SidebarMenu />
      </div>
    </div>
  );
}
