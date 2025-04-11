import { IChatItem, IMessage, IUser } from "@/type";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
} from "@heroui/react";
import { RiMessengerLine } from "react-icons/ri";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import ChatDrawer from "../shared/ChatDrawer";
import { logout } from "@/service/AuthService";
import { useSocketContext } from "@/context/socketContext";
import { useGetChatbyUserIdQuery } from "@/redux/features/chat/chatApi";
import Author from "../shared/Author";

export const UserDropdown: React.FC<{ user: IUser | null }> = ({ user }) => {
  if (!user) {
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
          name={user.name}
          size="sm"
          src={user.profileImage}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user.email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          as={Link}
          href={`/profile?id=${user?._id}`}
        >
          <div className="flex items-center space-x-2">
            <Avatar radius="full" size="sm" src={user.profileImage} />
            <span>{user.name}</span>
          </div>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            logout();
            window.location.reload();
          }}
          key="logout"
          color="danger"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const ChatDropdown: React.FC<{ user: IUser }> = ({ user }) => {
  const { data: chatData } = useGetChatbyUserIdQuery(
    { senderId: user?._id as string },
    { skip: !user?._id }
  );
  // console.log({ chatData });
  const { socket } = useSocketContext();
  const [selectedUser, setSelectedUser] = useState();
  console.log({ selectedUser });
  console.log({ user });

  console.log({ selectedUser });

  const toggleMap = selectedUser ? selectedUser : chatData?.data;
  console.log({ toggleMap });

  const getAndSetUser = (item) => {
    return (
      <User
        name={
          user?._id !== item?.receiverId?._id
            ? item?.receiverId?.name
            : item?.senderId?.name
        }
        description={item?.lastMsg?.text}
        avatarProps={{
          // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          src: `${
            user?._id !== item?.receiverId?._id
              ? item?.receiverId?.profileImage
              : item?.senderId?.profileImage
          }`,
        }}
      />
    );
  };

  return (
    <>
      <Dropdown className=" w-[320px] ">
        <DropdownTrigger>
          <RiMessengerLine size={36} />
        </DropdownTrigger>
        {chatData?.data && (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {chatData?.data?.map((item, index) => {
              return (
                <DropdownItem
                  key={index}
                  className=" gap-2"
                  onClick={() => setSelectedUser(getAndSetUser(item))}
                >
                  {getAndSetUser(item)}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        )}
      </Dropdown>
      <ChatDrawer selectedUser={selectedUser} user={user} />
    </>
  );
};
