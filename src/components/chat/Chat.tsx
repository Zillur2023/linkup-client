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
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
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
  selectDrawerStatus,
  selectHasMoreMessages,
  selectSkipCount,
  setChat,
  setDrawerStatus,
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
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isTypingState, setIsTypingState] = useState(false);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const key = `${user?._id}_${selectedUser?._id}`;
  const chat = useAppSelector((state: RootState) =>
    key ? selectChatByKey(key)(state) : null
  );
  const hasMoreMessages = useAppSelector(selectHasMoreMessages(key));
  const skip = useAppSelector(selectSkipCount(key));
  const isDrawerOpen = useAppSelector(
    selectDrawerStatus(selectedUser?._id as string)
  );

  const drawerStatus = useAppSelector(
    (state: RootState) => state.chat.drawerStatus
  );

  const [createChat, { isLoading: createChatIsLoading }] =
    useCreateChatMutation();

  const {
    data: chatData,
    refetch: refetchChatData,
    isFetching: isFetchingChatData,
  } = useGetChatbyUserIdQuery(
    {
      senderId: user?._id as string,
      receiverId: selectedUser?._id,
      skip,
      limit: LIMIT,
    },
    { skip: !user?._id || !selectedUser?._id }
  );

  const handleNewMessageScroll = async (e: React.UIEvent<HTMLDivElement>) => {
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

  const handleDrawerChange = (isOpen: boolean) => {
    dispatch(
      setDrawerStatus({ key: selectedUser?._id as string, status: isOpen })
    );
  };

  const handleOpen = () => {
    if (!isDrawerOpen) {
      dispatch(
        setDrawerStatus({ key: selectedUser?._id as string, status: true })
      );
    }
  };

  useEffect(() => {
    typingAudioRef.current = new Audio("/typing.mp3");
    typingAudioRef.current.loop = true;
    notificationAudioRef.current = new Audio("/notification.mp3");
  }, []);
  // useEffect(() => {
  //   notificationAudioRef.current = new Audio("/notification.mp3");
  // }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      if (selectedUser?.key && user?._id && selectedUser?._id) {
        // if (!isOpen) {
        //   onOpen();
        // }
        if (!isDrawerOpen) {
          handleOpen();
        }

        try {
          const { data } = await refetchChatData().unwrap();
          const messages = data?.[0]?.messages || [];

          if (messages.length > 0) {
            dispatch(
              setChat({
                key,
                chat: {
                  ...data[0],
                  messages, // Ensure we're using the latest messages
                },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching chat data:", error);
        }
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
      if (notificationAudioRef.current) {
        const audio = notificationAudioRef.current;
        audio.pause(); // Reset any ongoing audio
        audio.currentTime = 0;
        audio.play().catch((err) => console.warn("Audio play failed:", err));
      }
      dispatch(
        appendMessage({
          key: `${user?._id}_${newMessage?.senderId?._id}`,
          message: newMessage,
        })
      );

      setMessageText("");
    };

    // Create audio instance once (outside of handlers)

    const handleUserTyping = ({ senderId }: { senderId: string }) => {
      if (
        // senderId === selectedUser?._id &&
        drawerStatus?.[senderId] &&
        typingAudioRef.current
      ) {
        // typingAudio.play();
        typingAudioRef.current
          .play()
          .catch((err) => console.warn("Play failed", err));
        setIsTypingState(true);
      }
    };

    const handleUserStoppedTyping = ({ senderId }: { senderId: string }) => {
      if (
        // senderId === selectedUser?._id &&
        drawerStatus?.[senderId] &&
        typingAudioRef.current
      ) {
        // typingAudio.pause();
        // typingAudio.currentTime = 0;
        typingAudioRef.current.pause();
        typingAudioRef.current.currentTime = 0;
        setIsTypingState(false);
      } else {
        if (typingAudioRef.current) {
          typingAudioRef.current.pause();
          typingAudioRef.current.currentTime = 0;
          setIsTypingState(false);
        }
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
  }, [socket, selectedUser, isDrawerOpen, user?._id]);

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
      dispatch(appendMessage({ key, message: data }));
      setMessageText("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
    }
  };

  return (
    <Drawer
      placement="bottom"
      shouldBlockScroll={false}
      // isOpen={isOpen}
      // onOpenChange={onOpenChange}
      isOpen={isDrawerOpen}
      onOpenChange={handleDrawerChange}
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
                skip={skip}
                isFetchingChatData={isFetchingChatData}
                createChatIsLoading={createChatIsLoading}
                handleNewMessageScroll={handleNewMessageScroll}
                hasMoreMessages={hasMoreMessages}
                messageText={messageText}
                isTypingState={isTypingState}
              />
            </DrawerBody>

            <DrawerFooter className=" !pt-0 !pb-2 !px-0 relative w-full mx-auto  ">
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
