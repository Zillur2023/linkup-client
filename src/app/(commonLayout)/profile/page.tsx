"use client";

import ProfileFriends from "@/components/profile/ProfileFriends";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import ProfileHome from "@/components/profile/ProfileHome";
import { useGetAllPostQuery } from "@/redux/features/post/postApi";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IPostData, IUserData } from "@/type";
import { usePathname, useSearchParams } from "next/navigation";

const ProfilePage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sk = searchParams.get("sk");

  const { data: userData } = useGetUserByIdQuery<IUserData>(id);

  const { data: postData } = useGetAllPostQuery<IPostData>({ userId: id! });

  const profileRoute = [
    { href: `${pathname}?id=${id}`, label: "posts" },
    { href: `${pathname}?id=${id}&sk=friends`, label: "friends" },
  ];

  const renderSection = () => {
    if (sk === "friends") {
      return <ProfileFriends user={userData?.data} />;
    }
    return <ProfileHome {...userData?.data} />;
  };
  return (
    <div>
      <ProfileHeader user={userData?.data} profileRoute={profileRoute} />
      <div className=" px-5">{renderSection()}</div>
    </div>
  );
};

export default ProfilePage;
