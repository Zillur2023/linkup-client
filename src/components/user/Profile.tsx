"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import Posts from "../post/Posts";
import Friends from "./Friends";
import Navbar from "../shared/Navbar";
import NotAvailablePage from "../shared/NotAvailablePage";

const Profile = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  // Dynamically render components based on the section
  const renderSection = () => {
    const profileName = userData?.data?.name;

    // Check if the pathname matches the profile or friends route
    if (pathname === `/${profileName}`) {
      return (
        <div className="w-[60%] mx-auto">
          <div className="w-full h-full">
            <Posts />
          </div>
        </div>
      );
    } else if (pathname === `/${profileName}/friends`) {
      return (
        <div className="w-[70%] mx-auto">
          <Friends />
        </div>
      );
    } else {
      // Show an error message if the route doesn't match
      return <NotAvailablePage />;
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
