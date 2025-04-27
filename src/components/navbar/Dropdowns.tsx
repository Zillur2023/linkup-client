import { IChat, IUser } from "@/type";
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
import { useEffect, useState } from "react";
import { logout } from "@/service/AuthService";
import { useSocketContext } from "@/context/socketContext";
import { useGetChatbyUserIdQuery } from "@/redux/features/chat/chatApi";
import { ISelectedUser } from "../common/UsersList";
import Chat from "../chat/Chat";

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
  const { data: chatData, refetch: refetchChatData } = useGetChatbyUserIdQuery(
    { senderId: user?._id as string },
    { skip: !user?._id }
  );

  const { socket } = useSocketContext();
  const [selectedUser, setSelectedUser] = useState<ISelectedUser | null>(null);
  const [myRecentLastChats, setMyRecentLastChats] = useState<IChat[]>([]);

  useEffect(() => {
    if (chatData) {
      setMyRecentLastChats(chatData?.data);
    }
  }, [chatData]);

  useEffect(() => {
    if (!socket) return;
    const handleMyRecentLastChats = (LastChats: any) => {
      setMyRecentLastChats(LastChats);
    };

    socket?.on("chat", handleMyRecentLastChats);

    return () => {
      socket?.off("chat", handleMyRecentLastChats);
    };
  }, [socket, setMyRecentLastChats]);

  const getUser = (item: any) => {
    return (
      <User
        name={
          user?._id === item?.senderId?._id
            ? item?.receiverId?.name
            : item?.senderId?.name
        }
        description={
          user?._id === item?.lastMsg?.senderId
            ? `You: ${item?.lastMsg?.text}`
            : item?.lastMsg?.text
        }
        avatarProps={{
          src: `${
            user?._id === item?.senderId?._id
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
          <RiMessengerLine size={36} onClick={() => refetchChatData()} />
        </DropdownTrigger>

        {myRecentLastChats && (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {myRecentLastChats?.map((item, index) => {
              console.log({ item });
              return (
                <DropdownItem
                  key={index}
                  className=" gap-2"
                  onClick={() => {
                    setSelectedUser({
                      key: Date.now(),
                      _id:
                        user?._id === item?.senderId?._id
                          ? (item?.receiverId?._id as string)
                          : (item?.senderId?._id as string),
                      label:
                        user?._id === item?.senderId?._id
                          ? item?.receiverId?.name
                          : item?.senderId?.name,
                      user: getUser(item),
                    });
                    // socket?.emit("fetchMyChats", {
                    //   senderId: user?._id,
                    //   receiverId:
                    //     user?._id === item?.senderId?._id
                    //       ? item?.receiverId?._id
                    //       : item?.senderId?._id,
                    // });
                  }}
                >
                  {getUser(item)}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        )}
      </Dropdown>
      <Chat selectedUser={selectedUser} />
    </>
  );
};
