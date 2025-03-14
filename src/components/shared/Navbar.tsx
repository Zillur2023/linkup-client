"use client";
import React, { useRef, useState } from "react";
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
  Tooltip,
  Tab,
  Tabs,
  Listbox,
  ListboxItem,
  Card,
} from "@heroui/react";
import {
  House,
  Store,
  Users,
  Link as LogoLink,
  Group,
  Search,
} from "lucide-react";
// import Link from "next/link";
import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";

export const menuItems = [
  { href: "/", label: "home", icon: <House /> },
  { href: "/friends", label: "friends", icon: <Users /> },
  { href: "/marketplace", label: "Marketplace", icon: <Store /> },
  { href: "#group", label: "group", icon: <Group /> },
];

export default function Navbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const { data: allUserData } = useGetAllUserQuery({ searchQuery: search });

  console.log({ search });
  const router = useRouter();

  const handleChange = () => {
    router.push(`/search/top?q=${search}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      inputRef.current.blur(); // Removes focus from input
      handleChange();
      // setIsFocused(false);
    }
  };

  // const handleSearchChange = (e: any) => {
  //   dispatch(setSearchTerm(e.target.value));
  // };
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
      className=" py-0     "
      maxWidth="full"
    >
      <NavbarContent className="  -ml-6  ">
        <NavbarMenuToggle
          className="md:hidden "
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />

        <Card
          shadow={
            search && isFocused && allUserData?.data?.length > 0 ? "md" : "none"
          }
          radius={
            search && isFocused && allUserData?.data?.length > 0 ? "md" : "none"
          }
          className="  px-1 py-2 absolute top-2 "
        >
          <div className=" flex items-center justify-center gap-1 ">
            <NavbarBrand>
              <LogoLink />
              <p className="font-bold md:text-2xl text-inherit">up</p>
            </NavbarBrand>

            <Input
              ref={inputRef}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              value={search}
              classNames={{
                base: "max-w-full sm:max-w-[10rem] ",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal border-green-400 bg-default-400/20 dark:bg-default-500/20",
              }}
              placeholder="Type to search..."
              size="sm"
              startContent={!isFocused && <Search strokeWidth={1} />}
              type="search"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {search &&
            isFocused &&
            allUserData?.data?.length > 0 && ( // Conditional rendering
              <Listbox
                aria-label="Dynamic Actions"
                // onAction={(key) => alert(key)}
              >
                {allUserData?.data?.map((item, i) => (
                  <ListboxItem
                    key={i}
                    as={Link}
                    href={`/profile?id=${item._id}`}
                    onClick={() => {
                      setSearch("");
                      // dispatch(setSearchTerm(""));
                      // dispatch(setUserId(item?._id));
                    }}
                    className={item.key === "delete" ? "text-danger" : ""}
                    color={item.key === "delete" ? "danger" : "default"}
                  >
                    {item.name}
                  </ListboxItem>
                ))}
              </Listbox>
            )}
        </Card>
      </NavbarContent>
      {user && (
        <NavbarContent className=" hidden sm:flex w-1/2  " justify="center">
          {/* <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem> */}

          <Tabs
            aria-label="Options"
            selectedKey={pathname}
            // fullWidth
            color="primary"
            variant="underlined"
          >
            {menuItems.map((item) => (
              <Tab
                key={item.href}
                className=" max-w-fit h-full"
                title={
                  <Tooltip content={item.label}>
                    <Button
                      className={`${
                        pathname === item.href ? "text-blue-500" : ""
                      }  `}
                      href={item.href}
                      as={Link}
                      variant="light"
                    >
                      {item.icon}
                    </Button>
                  </Tooltip>
                }
              />
            ))}
          </Tabs>
        </NavbarContent>
      )}

      <NavbarContent as="div" className="   -mr-6 " justify="end">
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
              <DropdownItem
                key={`${userData?.data?.email}`}
                className="h-14 gap-2"
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userData?.data?.email}</p>
              </DropdownItem>
              <DropdownItem
                key={`${userData?.data?.name}`}
                as={Link}
                href={`/${userData?.data?.name}`}
              >
                <div className="flex items-center space-x-2  ">
                  <Avatar
                    radius="full"
                    // size="sm"
                    className=" w-6 h-6"
                    src={userData?.data?.profileImage}
                  />
                  <span>{userData?.data?.name}</span>
                </div>
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
