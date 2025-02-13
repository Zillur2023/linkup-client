"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Button, Tab, Tabs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import Posts from "../post/Posts";
import Friends from "./Friends";

const Profile = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  // Dynamically render components based on the section
  const renderSection = () => {
    switch (pathname) {
      case `/${userData?.data?.name}`:
        return (
          <div className=" flex  bg-green-200 w-[70%]  mx-auto ">
            <div className=" w-[30%]  bg-default-100 dark:bg-default-100 h-screen p-1 ">
              <Button className=" my-4" fullWidth>
                Update profile
              </Button>
              <Friends />
            </div>
            <div className="w-[70%]  h-full ">
              <Posts />
            </div>
          </div>
        );
      case `/${userData?.data?.name}/friends`:
        return (
          <div className=" w-[70%] mx-auto  ">
            <Friends />
          </div>
        );
      default:
        return <p>Section not found</p>;
    }
  };

  return (
    <>
      <ProfileHeader user={userData?.data} />
      {renderSection()}
    </>
  );
};

export default Profile;

// const Profile = () => {
//   const pathname = usePathname();
//   console.log("profile pathname", pathname);
//   const { user } = useUser();
//   const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
//     skip: !user?._id,
//   });

//   return (
//     <div>
//       {/* {userData?.data && pathname === `/${userData.data.name}` && ( */}
//       <ProfileHeader user={userData?.data} />
//       {/* )} */}

//       <div className=" flex  justify-center">
//         <div className=" w-[30%] bg-default-100 dark:bg-default-100 h-screen p-1 ">
//           <Button className=" my-4" fullWidth>
//             Update profile
//           </Button>
//           <Friends />
//         </div>
//         <div className=" w-[70%] h-full">
//           <Posts />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
