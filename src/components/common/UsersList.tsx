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
import { useSocketContext, useUserStatus } from "@/context/socketContext";

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
  const [selectedUser, setSelectedUser] = useState<ISelectedUser | null>(null);
  const { onlineUsers } = useSocketContext();
  const { status, formattedLastActive } = useUserStatus(
    selectedUser?._id as string
  );
  console.log({ onlineUsers });
  console.log({ formattedLastActive });
  console.log({ status });
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });
  const { data: allUserData, isLoading } = useGetAllUserQuery({
    searchQuery: "",
  });

  if (isLoading) return <div>Loading users...</div>;

  const items: any = allUserData?.data
    ?.filter((usr: IUser) => usr._id !== user?._id)
    ?.map((user: IUser) => ({
      _id: user._id,
      label: user.name,
      icon: (
        <>
          {onlineUsers?.includes(user?._id as string) ? (
            <div className="relative inline-block">
              <Avatar
                className="w-6 h-6"
                src={user.profileImage}
                alt={user.name}
              />
              <span
                className={`absolute bottom-1 right-0 transform translate-x-1/2 translate-y-1/2  rounded-full w-2 h-2 border border-white
        ${
          status === "online"
            ? "bg-green-500"
            : status === "idle"
            ? "bg-yellow-500"
            : "bg-gray-400"
        }`}
              ></span>
            </div>
          ) : (
            <Avatar
              className="w-6 h-6"
              src={user.profileImage}
              alt={user.name}
            />
          )}
        </>
      ),
      user: (
        <>
          {onlineUsers?.includes(user?._id as string) ? (
            <div className="relative inline-block">
              <Author author={user} description={`${formattedLastActive}`} />
              <span
                className={`absolute bottom-4 left-6 transform translate-x-1/2 translate-y-1/2 rounded-full w-3 h-3 border border-white
                    ${
                      status === "online"
                        ? "bg-green-500"
                        : status === "idle"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    } `}
              ></span>
            </div>
          ) : (
            // {status === 'offline' ? formattedLastActive : 'Online'}
            <Author author={user} description={`${formattedLastActive}`} />
          )}
        </>
      ),
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
