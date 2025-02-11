"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Button } from "@heroui/react";
import { usePathname } from "next/navigation";
import FriendsList from "./FriendsList";
import { ProfileHeader } from "./ProfileHeader";

const Profile = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const friends = [
    {
      name: "Zillur Rahman",
      image:
        "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
    },
    {
      name: "Zillur Rahman",
      image:
        "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
    },
    {
      name: "Zillur Rahman",
      image:
        "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
    },
    {
      name: "Zillur Rahman",
      image:
        "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
    },
  ];

  return (
    <div className=" flex  justify-center">
      <div className=" w-[30%] bg-default-100 dark:bg-default-100 h-screen p-1 ">
        <Button className=" my-4" fullWidth>
          Update profile
        </Button>
        <FriendsList friends={friends} />
      </div>
      <div className=" w-[70%] h-full">
        {userData?.data && pathname === `/${userData.data.name}` && (
          //   <ProfileHeader {...userData.data}  />
          <ProfileHeader user={userData?.data} friends={friends} />
        )}
      </div>
    </div>
  );
};

export default Profile;
