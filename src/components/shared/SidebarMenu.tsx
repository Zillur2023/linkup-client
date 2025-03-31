"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { Avatar, Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import { Group, House, Store, Users } from "lucide-react";
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
  // console.log({ url });

  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
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
    { href: "/", label: "Home", icon: <House /> },
    { href: "/friends", label: "Friends", icon: <Users /> },
    { href: "/marketplace", label: "Marketplace", icon: <Store /> },
    { href: "#group", label: "Group", icon: <Group /> },
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
