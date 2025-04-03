"use client";

import React, { useState, useRef } from "react";
import {
  Navbar as HeroUiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { FiHome } from "react-icons/fi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { AiTwotoneShop } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import TabsMenu from "../shared/TabsMenu";
import { ChatDropdown, UserDropdown } from "./Dropdowns";
import SearchBar from "./SearchBar";
import { CiShop } from "react-icons/ci";

// Define types for better type safety
interface MenuItem {
  href: string;
  label: React.ReactNode;
  icon: string;
}

const menuItems: MenuItem[] = [
  { href: "/", label: <FiHome size={24} />, icon: "home" },
  {
    href: "/friends",
    label: <LiaUserFriendsSolid size={24} />,
    icon: "friends",
  },
  {
    href: "/marketplace",
    label: <CiShop strokeWidth={0.5} size={24} />,
    icon: "marketplace",
  },
  { href: "#group", label: <GrGroup size={24} />, icon: "group" },
  // { href: "#menu", label: <Menu />, icon: "menu" },
];

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });
  const { data: allUserData } = useGetAllUserQuery({ searchQuery: search });
  console.log({ allUserData });

  const handleSearchSubmit = () => {
    router.push(`/search/top?q=${search}`);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="  lg:hidden">
        <HeroUiNavbar
          // position="static"
          // shouldHideOnScroll
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className="py-0 "
          maxWidth="full"
        >
          <NavbarContent className=" w-[20%] ">
            <NavbarBrand>LinkUp</NavbarBrand>
          </NavbarContent>
          <NavbarContent className=" w-[40%] md:w-[60%] " justify="center">
            <div className=" w-full  flex justify-end -mr-[18%]">
              <SearchBar
                search={search}
                isFocused={isFocused}
                onSearchChange={setSearch}
                onFocusChange={setIsFocused}
                onSearchSubmit={handleSearchSubmit}
                searchResults={
                  Array.isArray(allUserData?.data)
                    ? allUserData?.data
                    : allUserData?.data
                    ? [allUserData?.data]
                    : []
                }
                inputRef={inputRef}
              />
            </div>
          </NavbarContent>

          <NavbarContent className="w-[20%]  " as={"div"} justify="end">
            {userData?.data && <ChatDropdown user={userData?.data} />}
            <UserDropdown user={userData?.data || null} />
          </NavbarContent>
          <NavbarMenu>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link href={item.href} className="w-full flex gap-1">
                  {item.icon} {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </HeroUiNavbar>
        <HeroUiNavbar
          isBordered
          className="py-0 "
          position="static"
          // shouldHideOnScroll
          maxWidth="full"
        >
          <NavbarContent className="flex w-full " justify="center">
            <div className=" md:hidden">
              <TabsMenu
                selectedKey={pathname}
                items={menuItems}
                tooltip={true}
                isIconOnly={true}
              />
            </div>
            <div className=" hidden md:block">
              <TabsMenu
                selectedKey={pathname}
                items={menuItems}
                tooltip={true}
              />
            </div>
          </NavbarContent>
        </HeroUiNavbar>
      </div>

      {/* Desktop Navbar */}
      <HeroUiNavbar
        isBordered
        // className="py-0 "
        // position="sticky"
        // shouldHideOnScroll
        className=" hidden lg:block"
        maxWidth="full"
      >
        <NavbarContent className="-ml-6 ">
          <SearchBar
            search={search}
            isFocused={isFocused}
            onSearchChange={setSearch}
            onFocusChange={setIsFocused}
            onSearchSubmit={handleSearchSubmit}
            searchResults={
              Array.isArray(allUserData?.data)
                ? allUserData?.data
                : allUserData?.data
                ? [allUserData?.data]
                : []
            }
            inputRef={inputRef}
          />
        </NavbarContent>
        <NavbarContent className="sm:flex w-full md:w-1/2 " justify="center">
          <TabsMenu selectedKey={pathname} items={menuItems} tooltip={true} />
        </NavbarContent>
        <NavbarContent className="-mr-6 " as={"div"} justify="end">
          {userData?.data && <ChatDropdown user={userData?.data || null} />}
          <UserDropdown user={userData?.data || null} />
        </NavbarContent>
      </HeroUiNavbar>
    </>
  );
};

export default Navbar;
