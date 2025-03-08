"use client";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Listbox, ListboxItem, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import { Group, House, Store, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SidebarMenu() {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const userName = userData?.data?.name;

  const sidebarItems = [
    {
      href: `/${userName}_${userData?.data?._id}`,
      label: `${userName ? userName : "User "}`,
      icon: (
        <Avatar
          // radius="full"
          // size="sm"
          className=" w-6 h-6  "
          src={userData?.data?.profileImage}
        />
      ),
    },
    { href: "/", label: "home", icon: <House /> },
    { href: "/friends", label: "Friends", icon: <Users /> },
    { href: "/marketplace", label: "Marketplace", icon: <Store /> },
    { href: "#group", label: "Group", icon: <Group /> },
  ];

  const [selectedKeys, setSelectedKeys] = useState(new Set([pathname]));
  console.log({ selectedKeys });
  console.log({ pathname });

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(new Set([keys]));
  };

  return (
    <Listbox
      items={sidebarItems}
      aria-label="Single selection example"
      selectedKeys={selectedKeys}
      selectionMode="single"
      hideSelectedIcon
      // variant="flat"
      autoFocus
      onSelectionChange={handleSelectionChange}
    >
      {(item) => (
        <ListboxItem
          key={item?.href}
          as={Link}
          href={item?.href}
          startContent={item.icon}
        >
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  );
}
