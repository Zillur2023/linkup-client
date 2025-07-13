"use client";

import { Suspense } from "react";
import ProfileFriends from "@/components/profile/ProfileFriends";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { usePathname, useSearchParams } from "next/navigation";
import Profile from "@/components/profile/Profile";

const ProfilePageContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sk = searchParams.get("sk");

  const { data: userData } = useGetUserByIdQuery(id as string);

  const profileRoute = [
    { href: `${pathname}?id=${id}`, label: "posts" },
    { href: `${pathname}?id=${id}&sk=friends`, label: "friends" },
  ];

  const renderSection = () => {
    if (userData?.data) {
      if (sk === "friends") {
        return <ProfileFriends user={userData?.data} />;
      }
      return <Profile {...userData?.data} />;
    }
  };

  return (
    <div>
      {userData?.data && (
        <ProfileHeader user={userData?.data} profileRoute={profileRoute} />
      )}
      <div className="px-5">{renderSection()}</div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
