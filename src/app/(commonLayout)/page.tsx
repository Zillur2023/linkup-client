import Posts from "@/components/post/Posts";
import Navbar from "@/components/shared/Navbar";
import SidebarMenu from "@/components/shared/SidebarMenu";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className=" flex ">
        <div className={`hidden md:block  md:w-[20%]`}>
          <SidebarMenu />
        </div>

        <div className={`hidden md:block  md:w-[60%]`}>
          <Posts />
        </div>

        <div className={`hidden md:block  md:w-[20%]`}>Part 3</div>
      </div>
    </div>
  );
}
