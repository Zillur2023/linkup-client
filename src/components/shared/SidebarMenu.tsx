"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { Avatar, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CiShop } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { usePathname } from "next/navigation";

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
  // const searchParams = useSearchParams();
  // const query = searchParams.get("q");
  // const id = searchParams.get("id");
  // const url = query ? `${pathname}?q=${query}` : `${pathname}?id=${id}`;

  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const userName = userData?.data?.name || "User";
  const profileImage = userData?.data?.profileImage || "";

  const defaultItems: MenuItem[] = [
    {
      href: `/profile?id=${userData?.data?._id}`,
      label: userName,
      icon: <Avatar className="w-6 h-6" src={profileImage} />,
    },
    { href: "/", label: "Home", icon: <FiHome size={24} /> },
    {
      href: "/friends",
      label: "Friends",
      icon: <LiaUserFriendsSolid size={24} />,
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: <CiShop strokeWidth={0.5} size={24} />,
    },
    { href: "#group", label: "Group", icon: <GrGroup size={24} /> },
  ];

  const menuItems = items ? items : defaultItems;
  // const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([url]));

  // const handleSelectionChange = (keys: any) => {
  //   setSelectedKeys(new Set([keys as string]));
  // };

  return (
    <>
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        fullWidth
        placement="start"
        variant="light"
        className=" "
      >
        {menuItems?.map((item) => (
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
      {/* <Listbox
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
            // className=" py-3"
          >
            {item.label}
          </ListboxItem>
        )}
      </Listbox> */}
    </>
  );
}
