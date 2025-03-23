"use client";

import React, { useState, useRef } from "react";
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
  User,
} from "@heroui/react";
import {
  Search,
  House,
  Users,
  Store,
  Menu,
  Group,
  MessageCircleMore,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import TabsMenu from "./TabsMenu";
import { IUser } from "@/type";

// Define types for better type safety
interface MenuItem {
  href: string;
  label: React.ReactNode;
  icon: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface SearchBarProps {
  search: string;
  isFocused: boolean;
  onSearchChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
  onSearchSubmit: () => void;
  searchResults: UserData[];
  inputRef: React.RefObject<HTMLInputElement | null>;
}

// Menu items for the navbar
const menuItems: MenuItem[] = [
  { href: "/", label: <House />, icon: "home" },
  { href: "/friends", label: <Users />, icon: "friends" },
  { href: "/marketplace", label: <Store />, icon: "marketplace" },
  { href: "#group", label: <Group />, icon: "group" },
  // { href: "#menu", label: <Menu />, icon: "menu" },
];

// SearchBar Component
const SearchBar: React.FC<SearchBarProps> = ({
  search,
  isFocused,
  onSearchChange,
  onFocusChange,
  onSearchSubmit,
  searchResults,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      inputRef.current.blur(); // Removes focus from input
      onSearchSubmit();
    }
  };

  return (
    <Card
      shadow={search && isFocused && searchResults.length > 0 ? "md" : "none"}
      radius={search && isFocused && searchResults.length > 0 ? "md" : "none"}
      className="px-1 py-2 absolute top-2"
    >
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          classNames={{
            base: ` w-[8rem]  md:w-[10rem]  md:w-full 
          
            `,
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={!isFocused && <Search strokeWidth={1} />}
          type="search"
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
      </div>
      {search && isFocused && searchResults.length > 0 && (
        <Listbox aria-label="Search Results">
          {searchResults.map((user) => (
            <ListboxItem
              key={user._id}
              as={Link}
              href={`/profile?id=${user._id}`}
              onClick={() => onSearchChange("")}
              color="default"
            >
              {user.name}
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </Card>
  );
};

// UserDropdown Component
const UserDropdown: React.FC<{ userData: UserData | null }> = ({
  userData,
}) => {
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
          name={userData.name}
          size="sm"
          src={userData.profileImage}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{userData.email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          as={Link}
          href={`/profile?id=${userData?._id}`}
        >
          <div className="flex items-center space-x-2">
            <Avatar radius="full" size="sm" src={userData.profileImage} />
            <span>{userData.name}</span>
          </div>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const ChatDropdown: React.FC<{ userData: IUser | null }> = ({ userData }) => {
  // Use a Map to store the last chat for each unique senderId-receiverId pair
  const lastChatsMap = new Map();

  userData?.chats?.forEach((chat) => {
    // Create a sorted key to handle reverse pairs (e.g., user1-user2 and user2-user1)
    const key = [chat.senderId._id, chat.receiverId._id].sort().join("-");

    // If the key doesn't exist in the Map or the current chat is more recent, add/update it
    if (
      !lastChatsMap.has(key) ||
      new Date(String(chat.createdAt)) >
        new Date(lastChatsMap.get(key).createdAt)
    ) {
      lastChatsMap.set(key, chat);
    }
  });

  // Convert the Map values back into an array of last chats
  const lastChatsArray = Array.from(lastChatsMap.values());

  console.log({ lastChatsArray });
  // console.log("chatDropdown UserDta", userData)

  return (
    <Dropdown>
      <DropdownTrigger>
        <MessageCircleMore size={36} />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        {lastChatsArray.map((item) => (
          <DropdownItem key={item._id} className="h-14 gap-2">
            <User
              avatarProps={{
                src:
                  item.senderId._id === userData?._id
                    ? item.receiverId.profileImage // If the sender is the current user, show receiver's profile image
                    : item.senderId.profileImage, // If the receiver is the current user, show sender's profile image
              }}
              description={
                item.senderId._id === userData?._id
                  ? `You: ${item.content}` // If the sender is the current user
                  : item.content // If the sender is someone else
              }
              name={
                item.senderId._id === userData?._id
                  ? item.receiverId.name // If the sender is the current user, show receiver's name
                  : item.senderId.name // If the receiver is the current user, show sender's name
              }
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

// Navbar Component
const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id, {
    skip: !user?._id,
  });
  const { data: allUserData } = useGetAllUserQuery({ searchQuery: search });

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
                searchResults={allUserData?.data || []}
                inputRef={inputRef}
              />
            </div>
          </NavbarContent>

          <NavbarContent className="w-[20%]  " as={"div"} justify="end">
            <ChatDropdown userData={userData?.data || null} />
            <UserDropdown userData={userData?.data || null} />
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
            searchResults={allUserData?.data || []}
            inputRef={inputRef}
          />
        </NavbarContent>
        <NavbarContent className="sm:flex w-full md:w-1/2 " justify="center">
          <TabsMenu selectedKey={pathname} items={menuItems} tooltip={true} />
        </NavbarContent>
        <NavbarContent className="-mr-6 " as={"div"} justify="end">
          <ChatDropdown userData={userData?.data || null} />
          <UserDropdown userData={userData?.data || null} />
        </NavbarContent>
      </HeroUiNavbar>
    </>
  );
};

export default Navbar;
