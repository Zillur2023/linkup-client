import {
  useCreateChatMutation,
  useGetChatbyUserIdQuery,
} from "@/redux/features/chat/chatApi";
import { IChat, IMessage } from "@/type";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSocketContext } from "@/context/socketContext";
import { ISelectedUser } from "../common/UsersList";
import { useUser } from "@/context/UserProvider";
import ChatMessage from "./ChatMessage";
import ChatMessageForm from "./ChatMessageForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  appendMessage,
  incrementSkipCount,
  prependMessages,
  selectChatByKey,
  selectHasMoreMessages,
  selectSkipCount,
  setChat,
  setHasMoreMessages,
} from "@/redux/features/chat/chatSlice";
import { RootState } from "@/redux/store";

type TMessageContent = {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
};
const LIMIT = 10;

const Chat = ({ selectedUser }: { selectedUser: ISelectedUser | null }) => {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();
  const [messageText, setMessageText] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isTypingState, setIsTypingState] = useState(false); // Renamed to avoid confusion
  // const [skip, setSkip] = useState(0);
  const key = `${user?._id}_${selectedUser?._id}`;
  const chat = useAppSelector((state: RootState) =>
    key ? selectChatByKey(key)(state) : null
  );
  const hasMoreMessages = useAppSelector(selectHasMoreMessages(key));
  const skip = useAppSelector(selectSkipCount(key));

  const [createChat, { isLoading: createChatIsLoading }] =
    useCreateChatMutation();

  const { data: chatData, refetch: refetchChatData } = useGetChatbyUserIdQuery(
    {
      senderId: user?._id as string,
      receiverId: selectedUser?._id,
      skip,
      limit: LIMIT,
    },
    { skip: !user?._id || !selectedUser?._id }
  );

  const handleNewMessageScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    console.log("selectedUser?._id", selectedUser?._id);
    const element = e.currentTarget;

    // if (element.scrollTop === 0 && setHasMoreMessage) {
    if (element.scrollTop === 0) {
      // if (isAtBottom && setHasMoreMessage) {

      const { data } = await refetchChatData().unwrap();

      const newMessages = data?.[0]?.messages || [];

      if (newMessages.length > 0) {
        dispatch(
          prependMessages({
            key,
            messages: newMessages,
          })
        );
        dispatch(incrementSkipCount({ key, amount: LIMIT }));
      }
      dispatch(
        setHasMoreMessages({
          key,
          hasMore: newMessages.length >= LIMIT,
        })
      );
    }
  };

  // useEffect(() => {
  //   if (selectedUser?.key) {
  //     if (!isOpen) {
  //       onOpen();
  //       setSkip(0);
  //     }
  //     // setChat(null);
  //     refetchChatData();
  //   }
  // }, [selectedUser?.key, onOpen, refetchChatData]);
  useEffect(() => {
    const fetchChatData = async () => {
      if (selectedUser?.key && user?._id && selectedUser?._id) {
        if (!isOpen) {
          onOpen();
        }

        // try {
        //   const { data } = await refetchChatData().unwrap();
        //   const messages = data?.[0]?.messages || [];
        //   console.log({ data });

        //   if (messages.length > 0) {
        //     dispatch(
        //       setChat({
        //         key,
        //         chat: {
        //           ...data[0],
        //           messages, // Ensure we're using the latest messages
        //         },
        //       })
        //     );
        //   }
        // } catch (error) {
        //   console.error("Error fetching chat data:", error);
        // }
      }
    };

    fetchChatData();
  }, [selectedUser?.key]);

  useEffect(() => {
    if (chatData?.data?.[0]?.messages) {
      const fetchedMessages = chatData.data[0].messages;

      if (chat) {
        dispatch(prependMessages({ key, messages: fetchedMessages }));
      } else {
        dispatch(setChat({ key, chat: chatData.data[0] }));
      }
    }
  }, [chatData]);

  useEffect(() => {
    if (!socket && !selectedUser?._id) return;

    // const handleSenderNewMessage = (newMessage: IMessage) => {
    //   dispatch(appendMessage({ key, message: newMessage }));

    //   setMessageText("");
    // };
    const handleReceiverNewMessage = (newMessage: IMessage) => {
      const messageAudio = new Audio("/notification.mp3");
      messageAudio.play();

      dispatch(appendMessage({ key, message: newMessage }));

      setMessageText("");
    };

    // Create audio instance once (outside of handlers)
    const typingAudio = new Audio("/typing.mp3");
    typingAudio.loop = true; // optional: loop while user is typing

    const handleUserTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === selectedUser?._id) {
        typingAudio.play();
        setIsTypingState(true);
      }
    };

    const handleUserStoppedTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === selectedUser?._id) {
        typingAudio.pause();
        typingAudio.currentTime = 0;
        setIsTypingState(false);
      }
    };

    // socket?.on("myRecentChats", (myRecentChats) => {
    //   setChat(myRecentChats);
    // });

    // socket?.on("senderNewMessage", handleSenderNewMessage);
    socket?.on("receiverNewMessage", handleReceiverNewMessage);
    socket?.on("userTyping", handleUserTyping);
    socket?.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      // socket?.off("senderNewMessage", handleSenderNewMessage);
      socket?.off("receiverNewMessage", handleReceiverNewMessage);
      socket?.off("userTyping", handleUserTyping);
      socket?.off("userStoppedTyping", handleUserStoppedTyping);
      // socket?.off("myRecentChats");
    };
  }, [socket, selectedUser, isOpen, onOpen, user?._id]);

  // const onSubmit = (data) => console.log(data);
  // const handleCreateChat = async (
  const handleSubmit = async (
    content: TMessageContent & { reset: () => void }
  ) => {
    try {
      const { text = "", imageUrl = "", videoUrl = "", reset } = content;
      setMessageText(text);

      const newChat = {
        senderId: user?._id,
        receiverId: !chat
          ? selectedUser?._id
          : chat.senderId?._id === user?._id
          ? chat.receiverId?._id
          : chat.senderId?._id,
        text,
        imageUrl,
        videoUrl,
        isSeen: false,
      };

      socket?.emit("fetchMyChats", { senderId: user?._id });
      reset();
      const { data } = await createChat(newChat).unwrap();
      console.log(data);
      dispatch(appendMessage({ key, message: data }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
    }
  };

  return (
    <Drawer
      placement="bottom"
      shouldBlockScroll={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      backdrop="transparent"
      className="w-[80%] md:w-[40%] lg:w-[23%] bottom-0 left-[10%] md:left-[50%] lg:left-[70%]"
    >
      <DrawerContent>
        {() => (
          // {(onClose) => (
          <>
            <DrawerHeader className=" !pt-2 !pb-1 !px-2 ">
              <div className="text-start">{selectedUser?.user}</div>
            </DrawerHeader>

            <DrawerBody className="!px-2">
              <ChatMessage
                chat={chat as IChat}
                currentUserId={user?._id as string}
                createChatIsLoading={createChatIsLoading}
                handleNewMessageScroll={handleNewMessageScroll}
                hasMoreMessages={hasMoreMessages}
                messageText={messageText}
              />
            </DrawerBody>

            <DrawerFooter className=" !pt-1 !pb-2 !px-0 relative w-full mx-auto  ">
              <div>
                {isTypingState && (
                  <div className="absolute -mt-5  text-gray-500 text-sm italic z-50 ">
                    {selectedUser?.label} typing...
                  </div>
                )}
              </div>
              <div className="w-full ">
                <ChatMessageForm
                  onSubmit={handleSubmit}
                  selectedUser={selectedUser}
                />
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default Chat;
