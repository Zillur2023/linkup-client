"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Listbox, ListboxItem } from "@heroui/react";
import Link from "next/link";
import { Group, House, Store, Users } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarMenuProps {
  items?: MenuItem[];
}

export default function SidebarMenu({ items }: SidebarMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const url = query ? `${pathname}?q=${query}` : pathname;
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const userName = userData?.data?.name || "User";
  const profileImage = userData?.data?.profileImage || "";

  const defaultItems: MenuItem[] = [
    {
      href: `/${userName}_${userData?.data?._id}`,
      label: userName,
      icon: <Avatar className="w-6 h-6" src={profileImage} />,
    },
    { href: "/", label: "Home", icon: <House /> },
    { href: "/friends", label: "Friends", icon: <Users /> },
    { href: "/marketplace", label: "Marketplace", icon: <Store /> },
    { href: "#group", label: "Group", icon: <Group /> },
  ];

  const menuItems = items ? items : defaultItems;
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([url]));

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(new Set([keys as string]));
  };

  return (
    <Listbox
      items={menuItems}
      aria-label="Sidebar Menu"
      selectedKeys={selectedKeys}
      selectionMode="single"
      hideSelectedIcon
      autoFocus
      onSelectionChange={handleSelectionChange}
    >
      {(item) => (
        <ListboxItem
          key={item.href}
          as={Link}
          href={item.href}
          startContent={item.icon}
        >
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  );
}
