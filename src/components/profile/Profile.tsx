"use client";

import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname, useSearchParams } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import NotAvailablePage from "../shared/NotAvailablePage";
import User from "./ProfileHome";
import ProfileFriends from "./ProfileFriends";

const Profile = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sk = searchParams.get("sk");

  // const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
  //   skip: !user?._id,
  // });
  const { data: userData } = useGetUserByIdQuery<IUserData>(
    // pathname?.replace("/", "")
    id
  );

  const { data: allUserData } = useGetAllUserQuery({
    // searchTerm,
    userId: id!,
  });

  // const userName = userName;
  // const userName = userData?.data?._id;
  const user_id = allUserData?.data?.[0]?._id;
  const userName = allUserData?.data?.[0]?.name;
  // const profileRoute = [
  //   { href: `/${userName}`, label: "posts" },
  //   { href: `/${userName}/friends`, label: "friends" },
  // ];
  const profileRoute = [
    { href: `/profile?id=${id}`, label: "posts" },
    { href: `/profile?id=${id}&sk=friends`, label: "friends" },
  ];

  // const isPathValid = profileRoute.some((route) => route.href === pathname);

  // if (!isPathValid) {
  //   return <NotAvailablePage />;
  // }

  // Render the appropriate section based on the pathname
  const renderSection = () => {
    if (sk === "friends") {
      return <ProfileFriends user={userData?.data} />;
    }
    return <User {...userData?.data} />;
  };
  return (
    <div>
      {/* <ProfileHeader user={userData?.data} profileRoute={profileRoute} /> */}
      <ProfileHeader user={userData?.data} profileRoute={profileRoute} />
      <div className=" px-5">{renderSection()}</div>
    </div>
  );
};

// export default Profile;
