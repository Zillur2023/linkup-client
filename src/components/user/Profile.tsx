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

  const userName = userData?.data?.name;
  const profileRoute = [
    { href: `/${userName}`, label: "posts" },
    { href: `/${userName}/friends`, label: "friends" },
  ];

  const isPathValid = profileRoute.some((route) => route.href === pathname);

  if (!isPathValid) {
    return <NotAvailablePage />;
  }

  // Render the appropriate section based on the pathname
  const renderSection = () => {
    switch (pathname) {
      case `/${userName}`:
        return <User {...userData?.data} />;
      case `/${userName}/friends`:
        return <Friends />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProfileHeader user={userData?.data} profileRoute={profileRoute} />
      <div className=" px-5">{renderSection()}</div>
    </div>
  );
};

export default Profile;
