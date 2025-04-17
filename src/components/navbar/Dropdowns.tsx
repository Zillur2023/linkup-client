import { IUser } from "@/type";
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
import ChatDrawer from "../chat/ChatDrawer";
import { logout } from "@/service/AuthService";
import { useSocketContext } from "@/context/socketContext";
import { useGetChatbyUserIdQuery } from "@/redux/features/chat/chatApi";
import { ISelectedUser } from "../common/UsersList";

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

  const [lastMessage, setLastMessage] = useState();

  useEffect(() => {
    if (!socket) return;

    socket.on("chat", (lastMessage) => {
      setLastMessage(lastMessage);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("chat");
    };
  }, [socket, lastMessage, setLastMessage]);

  return (
    <>
      <Dropdown className=" w-[320px] ">
        <DropdownTrigger>
          <RiMessengerLine size={36} onClick={() => refetchChatData()} />
        </DropdownTrigger>
        {/* {chatData?.data && (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {chatData?.data?.map((item, index) => {
              console.log({ item });
              return (
                <DropdownItem
                  key={index}
                  className=" gap-2"
                  onClick={() =>
                    setSelectedUser({ _id: item?._id, user: getUser(item) })
                  }
                >
                  {getUser(item)}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        )} */}
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key={"index"}
            className=" gap-2"
            onClick={() =>
              setSelectedUser({
                _id:
                  user?._id === chatData?.data?.senderId
                    ? (chatData?.data?.receiverId as string)
                    : (chatData?.data?.senderId as string),
                user: getUser(chatData?.data),
              })
            }
          >
            {getUser(chatData?.data)}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ChatDrawer selectedUser={selectedUser} />
    </>
  );
};
