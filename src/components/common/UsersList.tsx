"use client";
import React, { ReactNode, useState } from "react";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUser } from "@/type";
import { Avatar, Listbox, ListboxItem } from "@heroui/react";

import { useUser } from "@/context/UserProvider";
import ChatDrawer from "../chat/ChatDrawer";
import Author from "../shared/Author";

// Define types
export interface ISelectedUser {
  _id: string;
  label?: string;
  icon?: ReactNode;
  user?: ReactNode;
}

export type TItems = ISelectedUser[];

const UsersList = () => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });
  const { data: allUserData, isLoading } = useGetAllUserQuery({
    searchQuery: "",
  });
  const [selectedUser, setSelectedUser] = useState<ISelectedUser | null>(null);

  if (isLoading) return <div>Loading users...</div>;

  const items: any = allUserData?.data
    ?.filter((usr: IUser) => usr._id !== user?._id)
    ?.map((user: IUser) => ({
      _id: user._id,
      label: user.name,
      icon: (
        <Avatar className="w-6 h-6" src={user.profileImage} alt={user.name} />
      ),
      user: <Author author={user} description="Active now" />,
    }));

  return (
    <>
      {allUserData && allUserData?.data?.length - 1 === items.length && (
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
              onClick={() => setSelectedUser(item)}
              startContent={item.icon}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      )}
      <div className="hidden md:block">
        {userData?.data && <ChatDrawer selectedUser={selectedUser} />}
      </div>
    </>
  );
};

export default UsersList;
