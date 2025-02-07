"use client";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Listbox, ListboxItem } from "@heroui/react";
import { Group, Store, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type SidebarItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

export const sidebarItems: SidebarItem[] = [
  { href: "#", label: "Friends", icon: <Users /> },
  { href: "#", label: "Marketplace", icon: <Store /> },
  { href: "#", label: "Group", icon: <Group /> },
];

export default function SidebarMenu() {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  return (
    <div className="bg-default-100 dark:bg-default-100 h-screen max-w-[320px] p-4">
      <Listbox
        isVirtualized
        label="Select from 1000 items"
        virtualization={{
          maxListboxHeight: 400,
          itemHeight: 40,
        }}
      >
        <>
          {user && (
            <ListboxItem
              value={userData?.data?.name}
              as={Link}
              href="#"
              startContent={
                <Avatar
                  radius="full"
                  size="sm"
                  src={userData?.data?.images?.[0]}
                />
              }
            >
              {userData?.data?.name}
            </ListboxItem>
          )}
          {sidebarItems?.map((item) => (
            <ListboxItem
              key={item.label}
              value={item.label}
              as={Link}
              href={item.href}
              startContent={item.icon}
            >
              {item.label}
            </ListboxItem>
          ))}
        </>
      </Listbox>
    </div>
  );
}
