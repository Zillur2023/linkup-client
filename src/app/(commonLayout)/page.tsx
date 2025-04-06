// "use client";
import UsersList from "@/components/common/UsersList";
import Posts from "@/components/post/Posts";
import SidebarMenu from "@/components/shared/SidebarMenu";

export default function Home() {
  // const { data: allUserData } = useGetAllUserQuery({ searchQuery: "" });
  // const items = allUserData?.data?.map((user: IUser) => ({
  //   href: `/profile?id=${user._id}`,
  //   label: user?.name, // Assuming user has a name
  //   icon: <Avatar className="w-6 h-6" src={user?.profileImage} />,
  // }));

  return (
    <div className=" flex justify-center  gap-2 my-5   ">
      <div className="hidden md:block  md:w-[25%] sticky md:top-0 lg:top-[65px]  h-[calc(100vh-90px)]  overflow-y-auto   ">
        <SidebarMenu />
      </div>

      <div className=" md:block  w-full  md:w-[50%] lg:px-10    ">
        <Posts />
        {/* {"Zillur Home Pageee"} */}
      </div>

      <div className="hidden md:block  md:w-[25%]  sticky md:top-0 lg:top-[65px]  h-[calc(100vh-90px)]    overflow-y-auto   ">
        <h3 className=" text-xl font-medium text-neutral-800">Users</h3>
        {/* <SidebarMenu items={items} /> */}
        <UsersList />
      </div>
    </div>
  );
}
