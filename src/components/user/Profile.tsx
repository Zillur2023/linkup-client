"use client";

import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import Friends from "./Friends";
import NotAvailablePage from "../shared/NotAvailablePage";
import User from "./User";
import { useAppSelector } from "@/redux/hooks";

const Profile = () => {
  const userId = useAppSelector((state) => state.search.userId);
  console.log({ userId });
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  console.log({ searchTerm });

  // console.log({ id });
  const pathname = usePathname();
  console.log({ pathname });
  const { user } = useUser();
  // const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
  //   skip: !user?._id,
  // });
  const { data: userData } = useGetUserByIdQuery<IUserData>(
    // pathname?.replace("/", "")
    userId
  );

  console.log({ userData });

  const { data: allUserData } = useGetAllUserQuery({
    // searchTerm,
    userId,
  });

  // console.log("pathname.replace()", pathname?.replace("/", ""));

  // console.log({ pathname });

  // console.log("allUserData?.data?.[0]", allUserData?.data?.[0]);

  // const userName = userName;
  // const userName = userData?.data?._id;
  const user_id = allUserData?.data?.[0]?._id;
  const userName = allUserData?.data?.[0]?.name;
  // const profileRoute = [
  //   { href: `/${userName}`, label: "posts" },
  //   { href: `/${userName}/friends`, label: "friends" },
  // ];
  const profileRoute = [
    { href: `/${userName}_${user_id}`, label: "posts" },
    { href: `/${userName}_${user_id}/friends`, label: "friends" },
  ];

  // const isPathValid = profileRoute.some((route) => route.href === pathname);

  // if (!isPathValid) {
  //   return <NotAvailablePage />;
  // }

  // Render the appropriate section based on the pathname
  const renderSection = () => {
    switch (pathname) {
      case `/${userName}_${user_id}`:
        return <User {...userData?.data} />;
      case `/${userName}_${user_id}/friends`:
        // case `/Zillur/friends`:
        return <Friends />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* <ProfileHeader user={userData?.data} profileRoute={profileRoute} /> */}
      <ProfileHeader user={userData?.data} profileRoute={profileRoute} />
      <div className=" px-5">{renderSection()}</div>
    </div>
  );
};

export default Profile;
