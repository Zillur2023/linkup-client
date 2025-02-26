"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import Friends from "./Friends";
import NotAvailablePage from "../shared/NotAvailablePage";

import User from "./User";

const Profile = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const profileName = userData?.data?.name;
  const accessRoute = [`/${profileName}`, `/${profileName}/friends`];

  const isPathValid = accessRoute.includes(pathname);

  if (!isPathValid) {
    return <NotAvailablePage />;
  }

  // Render the appropriate section based on the pathname
  const renderSection = () => {
    switch (pathname) {
      case `/${profileName}`:
        return <User />;
      case `/${profileName}/friends`:
        return <Friends />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProfileHeader user={userData?.data} />
      <div className=" px-5">{renderSection()}</div>
    </div>
  );
};

export default Profile;
