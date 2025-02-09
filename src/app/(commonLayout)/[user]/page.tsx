"use client";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUser, IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { Camera, Edit, UserPlus } from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { Group, Store, Users } from "lucide-react";
import { ProfileHeader } from "@/components/user/ProfileHeader";

export const sidebarItems = [
  { href: "#", label: "Friends", icon: <Users /> },
  { href: "#", label: "Marketplace", icon: <Store /> },
  { href: "#", label: "Group", icon: <Group /> },
];

const page = () => {
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
          <ProfileHeader {...userData.data} />
        )}
      </div>
    </div>
  );
};

export const FriendsList = ({
  friends,
}: {
  friends: { name?: string; image?: string }[];
}) => {
  return (
    <div className="">
      <h3 className="text-lg font-semibold mb-2">Friends</h3>
      <div className="grid grid-cols-2 gap-2 ">
        {friends.map((friend, i) => (
          <div key={i} className="flex flex-col items-center">
            <Avatar
              radius="lg"
              src={friend.image} // Default Image
              className=" w-28 h-28 "
            />
            <p className="text-sm font-semibold text-default-500">
              {friend.name}
            </p>{" "}
            {/* Default Name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
