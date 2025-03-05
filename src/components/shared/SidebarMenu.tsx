"use client";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import { Group, Store, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SidebarMenu() {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const userName = userData?.data?.name;

  const sidebarItems = [
    {
      href: `/${userName}`,
      label: `${userName ? userName : "User "}`,
      icon: (
        <Avatar
          radius="full"
          className=" w-6 h-6 "
          src={userData?.data?.profileImage}
        />
      ),
    },
    { href: "/friends", label: "Friends", icon: <Users /> },
    { href: "/marketplace", label: "Marketplace", icon: <Store /> },
    { href: "#group", label: "Group", icon: <Group /> },
  ];

  return (
    <div>
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        fullWidth
        placement="start"
        variant="light"
        className=" "
      >
        {/* {userData?.data && (
          <Tab
            key={`/${userData?.data?.name}`}
            href={`/${userData?.data?.name}`}
            as={Link}
            title={
              <div className="flex items-center space-x-2 border-2 ">
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
        )} */}

        {/* {sidebarItems?.map((item) => (
          <Tab
            key={item.href}
            // as={TabButton}
            // as={Button}
            title={
              <Button
                fullWidth
                variant="light"
                startContent={item.icon}
                href={item.href}
                as={Link}
                className=" w-full   border-2 border-green-400 "
                size="sm"
              >
                {" "}
                {item.label}{" "}
              </Button>
            }
            className="  w-full flex justify-start  border-2 border-red-500 "
          />
        ))} */}
        {sidebarItems?.map((item) => (
          <Tab
            key={item.href}
            href={item.href}
            as={Link}
            title={
              <div className="flex justify-center items-center space-x-2">
                <span>{item.icon}</span>
                <span> {item.label} </span>
              </div>
            }
            className="  flex justify-start hover:bg-default-200"
          />
        ))}
      </Tabs>
    </div>
  );
}
