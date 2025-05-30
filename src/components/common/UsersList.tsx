"use client";
import React, { ReactNode, useState } from "react";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IUser } from "@/type";
import { Avatar, Listbox, ListboxItem } from "@heroui/react";

import { useUser } from "@/context/UserProvider";
import Author from "../shared/Author";
import { useSocketContext } from "@/context/socketContext";
import Chat from "../chat/Chat";

// Define types
export interface ISelectedUser {
  key?: number;
  _id: string;
  label?: string;
  icon?: ReactNode;
  user?: ReactNode;
}

export type TItems = ISelectedUser[];

const UsersList = () => {
  const { user } = useUser();
  const { onlineUsers } = useSocketContext();
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
    ?.map((filterUser: IUser) => ({
      key: Date.now(),
      // key: `${user?._id}_${filterUser?._id}`,
      _id: filterUser._id,
      label: filterUser.name,
      icon: (
        <>
          {onlineUsers?.includes(filterUser?._id as string) ? (
            <div className="relative inline-block">
              <Avatar
                className="w-6 h-6"
                src={filterUser.profileImage}
                alt={filterUser.name}
              />
              <span className="absolute bottom-1 right-0 transform translate-x-1/2 translate-y-1/2 bg-green-500 rounded-full w-2 h-2 border border-white"></span>
            </div>
          ) : (
            <Avatar
              className="w-6 h-6"
              src={filterUser.profileImage}
              alt={filterUser.name}
            />
          )}
        </>
      ),
      user: <Author author={filterUser} />,
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
          {(item: ISelectedUser) => {
            return (
              <ListboxItem
                key={item._id}
                onClick={() => {
                  setSelectedUser(item);
                  // socket?.emit("fetchMyChats", {
                  //   senderId: user?._id,
                  //   receiverId: item?._id,
                  // });
                }}
                startContent={item.icon}
              >
                {item.label}
              </ListboxItem>
            );
          }}
        </Listbox>
      )}
      <div className="hidden md:block">
        {userData?.data && <Chat selectedUser={selectedUser} />}
      </div>
    </>
  );
};

export default UsersList;
