"use client";
import React from "react";
import {
  Navbar as HeroUiNabvar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Input,
  Breadcrumbs,
  BreadcrumbItem,
  Tooltip,
  Tab,
  Tabs,
} from "@heroui/react";
import { House, Store, Users, Link as LogoLink, Group } from "lucide-react";
// import Link from "next/link";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const menuItems = [
  { href: "/", label: "home", icon: <House /> },
  { href: "/friends", label: "friends", icon: <Users /> },
  { href: "/marketplace", label: "Marketplace", icon: <Store /> },
  { href: "#group", label: "group", icon: <Group /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  // const { images } = useGetUserByIdQuery<IUserData>(user?._id, {
  //   skip: !user?._id,
  //   selectFromResult: ({ data }) => ({
  //     image: data?.data?.profileImages ?? null,  // Extract image, provide a default value
  //     data, // Keep original data structure
  //   }),
  // });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(menuItems[0].label);
  // const menuItems = [
  //   "Profile",
  //   "Dashboard",
  //   "Activity",
  //   "Analytics",
  //   "System",
  //   "Deployments",
  //   "My Settings",
  //   "Team Settings",
  //   "Help & Feedback",
  //   "Log Out",
  // ];
  // export const menuItems = [
  //   { href: "#", label: "Friends", icon: <Users /> },
  //   { href: "#", label: "Marketplace", icon: <Store /> },
  //   { href: "#", label: "Group", icon: <Group /> },
  // ];
  return (
    <HeroUiNabvar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className=" py-0"
      // classNames={{
      //   item: [
      //     "flex ",
      //     "relative",
      //     "h-full",
      //     "justify-between",
      //     // "items-center",
      //     "hover:bg-default-200 rounded",
      //     "data-[active=true]:after:content-['']",
      //     "data-[active=true]:after:absolute",
      //     "data-[active=true]:after:bottom-0",
      //     "data-[active=true]:after:left-0",
      //     "data-[active=true]:after:right-0",
      //     "data-[active=true]:after:h-[2px]",
      //     "data-[active=true]:after:rounded-[2px]",
      //     "data-[active=true]:after:bg-primary",
      //   ],
      // }}
      maxWidth="full"
    >
      <NavbarContent className="   ">
        <NavbarMenuToggle
          className="md:hidden "
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <div className=" flex items-center justify-center gap-2">
          <NavbarBrand>
            <LogoLink />
            <p className="font-bold md:text-2xl text-inherit">up</p>
          </NavbarBrand>
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </div>
      </NavbarContent>
      {user && (
        <NavbarContent className=" hidden sm:flex   w-1/2 " justify="center">
          {/* <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem> */}

          <Tabs
            aria-label="Options"
            selectedKey={pathname}
            fullWidth
            classNames={{
              tabList:
                "  h-full relative rounded-none  flex justify-evenly    ",
              cursor: " bg-blue-500",
              tab: "max-w-fit  h-full hover:bg-default-200 rounded-md p-4 ",
              tabContent: "group-data-[selected=true]:text-blue-500",
            }}
            color="primary"
            variant="underlined"
          >
            {menuItems.map((item) => (
              <Tab
                key={item.href}
                title={item.icon}
                href={item.href}
                as={Link}
              />
            ))}
          </Tabs>
        </NavbarContent>
      )}

      <NavbarContent as="div" className="    " justify="end">
        {userData ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                // color="secondary"
                name={userData?.data?.name}
                size="sm"
                src={userData?.data?.profileImage}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userData?.data?.email}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button as={Link} color="warning" href="login" variant="flat">
            Sign Up
          </Button>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem
            isActive={pathname === item.href}
            key={`${item}-${index}`}
            className={`${
              pathname === item.href ? "bg-default-200" : ""
            }  hover:bg-default-200 rounded-md `}
          >
            <Link
              className="w-full flex gap-1"
              // color={
              //   index === 2
              //     ? "warning"
              //     : index === menuItems.length - 1
              //     ? "danger"
              //     : "foreground"
              // }
              href={item?.href}
              // size="lg"
            >
              {item.icon} {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUiNabvar>
  );
}

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
