"use client";
import React, { ReactNode, useState } from "react";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUser, IUserData } from "@/type";
import { Avatar, Listbox, ListboxItem, User } from "@heroui/react";

import { useUser } from "@/context/UserProvider";
import ChatDrawer from "../shared/ChatDrawer";

// Define types
export interface ISelectedUser {
  _id: string;
  label: string;
  icon: ReactNode;
  user: ReactNode;
}

export type TItems = ISelectedUser[];

const UsersList = () => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const {
    data: allUserData,
    isLoading,
    isError,
  } = useGetAllUserQuery({ searchQuery: "" });
  const [selectedUser, setSelectedUser] = useState<ISelectedUser | null>(null);

  if (isLoading) return <div>Loading users...</div>;
  if (isError || !allUserData?.data)
    return <div>Failed to load users. Please try again later.</div>;

  const items = allUserData?.data
    ?.filter((usr: IUser) => usr._id !== user?._id)
    ?.map((user: IUser) => ({
      _id: user._id,
      label: user.name,
      icon: (
        <Avatar className="w-6 h-6" src={user.profileImage} alt={user.name} />
      ),
      user: (
        <User
          avatarProps={{ src: `${user.profileImage}` }}
          description="Active now"
          name={user.name}
        />
      ),
    }));

  return (
    <>
      {allUserData?.data?.length - 1 === items.length && (
        <Listbox
          items={items}
          aria-label="User List"
          selectionMode="single"
          hideSelectedIcon
          autoFocus
        >
          {(item: ISelectedUser) => (
            <ListboxItem
              key={item._id}
              onPress={() => setSelectedUser(item)}
              startContent={item.icon}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      )}
      <div className="hidden md:block">
        <ChatDrawer selectedUser={selectedUser} userData={userData?.data} />
      </div>
    </>
  );
};

export default UsersList;
