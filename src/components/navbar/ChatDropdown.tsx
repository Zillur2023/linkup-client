import { IChat, IUser } from "@/type";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { RiMessengerLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useSocketContext } from "@/context/socketContext";
import { useGetChatbyUserIdQuery } from "@/redux/features/chat/chatApi";
import { ISelectedUser } from "../common/UsersList";
import Chat from "../chat/Chat";
import Author from "../shared/Author";

export const ChatDropdown = ({ user }: { user: IUser }) => {
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

  return (
    <>
      <Dropdown className=" w-[320px] ">
        <DropdownTrigger>
          <RiMessengerLine size={36} onClick={() => refetchChatData()} />
        </DropdownTrigger>

        {myRecentLastChats && (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {myRecentLastChats?.map((item, index) => {
              const filterUser =
                user?._id === item?.senderId?._id
                  ? item?.receiverId
                  : item?.senderId;

              const lastMessage =
                user?._id === item?.lastMsg?.senderId?._id
                  ? `You: ${item?.lastMsg}`
                  : item?.lastMsg;

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
                      // user: getUser(item, true),
                      user: <Author author={filterUser} />,
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
                  <Author author={filterUser} description={item?.lastMsg} />
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
