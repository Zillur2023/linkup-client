"use client";

import React, { useRef, useState } from "react";
import {
  Navbar as HeroUiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  Input,
  Listbox,
  ListboxItem,
  Card,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  Search,
  House,
  Users,
  Store,
  Menu,
  Link as LogoLink,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { usePathname, useRouter } from "next/navigation";
import TabsMenu from "./TabsMenu";

// Menu items for the navbar
const menuItems = [
  { href: "/", label: <House />, icon: "home" },
  { href: "/friends", label: <Users />, icon: "friends" },
  { href: "/marketplace", label: <Store />, icon: "marketplace" },
  { href: "#menu", label: <Menu />, icon: "menu" },
];

const Navbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id, {
    skip: !user?._id,
  });
  const { data: allUserData } = useGetAllUserQuery({ searchQuery: search });

  // Handle search input keydown (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      inputRef.current.blur();
      router.push(`/search/top?q=${search}`);
    }
  };

  // Render the search bar with dropdown results
  const SearchBar = () => (
    <Card
      shadow={
        search && isFocused && allUserData?.data?.length > 0 ? "md" : "none"
      }
      radius={
        search && isFocused && allUserData?.data?.length > 0 ? "md" : "none"
      }
      className="px-1 py-2"
    >
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          classNames={{
            base: "max-w-full sm:max-w-[10rem]",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={!isFocused && <Search strokeWidth={1} />}
          type="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {search && isFocused && allUserData?.data?.length > 0 && (
        <Listbox aria-label="Search Results">
          {allUserData.data.map((item, i) => (
            <ListboxItem
              key={i}
              as={Link}
              href={`/profile?id=${item._id}`}
              onClick={() => setSearch("")}
              color="default"
            >
              {item.name}
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </Card>
  );

  // Render the user dropdown menu
  const UserDropdown = () => {
    if (!userData) {
      return (
        <Button as={Link} color="warning" href="login" variant="flat">
          Sign Up
        </Button>
      );
    }

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
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
          <DropdownItem
            key="settings"
            as={Link}
            href={`/${userData?.data?.name}`}
          >
            <div className="flex items-center space-x-2">
              <Avatar
                radius="full"
                size="sm"
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
    );
  };

  // Render the mobile navbar
  const MobileNavbar = () => (
    <HeroUiNavbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="py-0 md:hidden"
      maxWidth="full"
    >
      <NavbarContent className="w-[50%]">
        <NavbarBrand>LinkUp</NavbarBrand>
      </NavbarContent>
      <NavbarContent className="w-[50%]" justify="end">
        <SearchBar />
        <UserDropdown />
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
  );

  // Render the desktop navbar
  const DesktopNavbar = () => (
    <HeroUiNavbar isBordered className="py-0 hidden md:flex" maxWidth="full">
      <NavbarContent>
        <SearchBar />
      </NavbarContent>
      <NavbarContent className="sm:flex w-full md:w-1/2 " justify="center">
        <TabsMenu selectedKey={pathname} items={menuItems} tooltip={true} />
      </NavbarContent>
      <NavbarContent justify="end">
        <UserDropdown />
      </NavbarContent>
    </HeroUiNavbar>
  );

  return (
    <div>
      <MobileNavbar />
      <DesktopNavbar />
    </div>
  );
};

export default Navbar;
