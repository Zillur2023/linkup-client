"use client";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import { Group, Store, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export const sidebarItems = [
  { href: "/friends", label: "Friends", icon: <Users /> },
  { href: "/marketplace", label: "Marketplace", icon: <Store /> },
  { href: "#group", label: "Group", icon: <Group /> },
];

export default function SidebarMenu() {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  return (
    <Tabs
      aria-label="Options"
      selectedKey={pathname}
      fullWidth
      placement="start"
      className=" h-screen bg-default-100 py-3 "
    >
      {userData?.data && (
        <Tab
          key={`/${userData?.data?.name}`}
          href={`/${userData?.data?.name}`}
          as={Link}
          title={
            <div className="flex items-center space-x-2 ">
              <Avatar
                radius="full"
                size="sm"
                src={userData?.data?.profileImage}
              />
              <span>{userData?.data?.name}</span>
            </div>
          }
          className="  flex justify-start hover:bg-default-200"
        />
      )}

      {sidebarItems?.map((item) => (
        <Tab
          key={item.href}
          href={item.href}
          as={Link}
          title={
            <div className="flex items-start space-x-2">
              {item.icon}
              <span> {item.label} </span>
            </div>
          }
          className="  flex justify-start hover:bg-default-200"
        />
      ))}
    </Tabs>
  );
}
