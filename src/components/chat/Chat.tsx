import {
  useCreateChatMutation,
  useGetChatbyUserIdQuery,
} from "@/redux/features/chat/chatApi";
import {
  getSenderId,
  IChat,
  IMessage,
  TIncomingMessage,
  TLoadingMessage,
  TSubmitMessage,
} from "@/type";
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
import { RootState, store } from "@/redux/store";
import MessageForm from "./MessageForm";
import Message from "./Message";

const LIMIT = 10;

const Chat = ({ selectedUser }: { selectedUser: ISelectedUser | null }) => {
  const { user } = useUser();

  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();
  const [loadingMessage, setLoadingMessage] = useState<TLoadingMessage | null>(
    null
  );
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
  const isChatDrawerOpen = useAppSelector(
    selectDrawerStatus(selectedUser?._id as string)
  );

  // const drawerStatus = useAppSelector(
  //   (state: RootState) => state.chat.drawerStatus
  // );

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
    if (!isChatDrawerOpen) {
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
        if (!isChatDrawerOpen) {
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
        // dispatch(setChat({ key, chat: chatData.data[0] }));
      }
    }
  }, [chatData]);

  useEffect(() => {
    if (!socket && !selectedUser?._id) return;

    // const handleSenderNewMessage = (newMessage: IMessage) => {
    //   dispatch(appendMessage({ key, message: newMessage }));

    //   setMessageText("");
    // };

    const handleReceiverNewMessage = async (newMessage: TIncomingMessage) => {
      console.log({ newMessage });
      const { drawerStatus } = store.getState().chat;
      // const senderId = newMessage?.senderId?._id;
      const senderId = getSenderId(newMessage);
      console.log({ senderId });
      const isDrawerClosed = !drawerStatus?.[senderId as string];
      if (notificationAudioRef.current && isDrawerClosed) {
        const audio = notificationAudioRef.current;
        audio.pause(); // Reset any ongoing audio
        audio.currentTime = 0;
        audio.play().catch((err) => console.warn("Audio play failed:", err));
      }
      try {
        const key = `${user?._id}_${senderId}`;

        // Rest of your logic...
        if ("messages" in newMessage) {
          // Handle first message format
          dispatch(
            setChat({
              key,
              chat: { ...newMessage },
            })
          );
        } else {
          // Handle single message format
          dispatch(
            appendMessage({
              key,
              message: newMessage,
            })
          );
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }

      setLoadingMessage(null);
    };

    // Create audio instance once (outside of handlers)

    const handleUserTyping = ({ senderId }: { senderId: string }) => {
      const { drawerStatus } = store.getState().chat;
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
      const { drawerStatus } = store.getState().chat;
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
  }, [socket, selectedUser, isChatDrawerOpen, user?._id]);

  // const onSubmit = (data) => console.log(data);
  // const handleCreateChat = async (
  const handleSubmit = async (
    messageWithReset: TSubmitMessage & { reset: () => void }
  ) => {
    try {
      const formData = new FormData();
      const { reset, ...message } = messageWithReset;

      const { like, text, images, voice } = message;
      setLoadingMessage(message);

      if (text) {
        formData.append("text", text.trim());
      }

      // if (audioUrl) {
      //   formData.append("audioUrl", audioUrl, "recording.webm");
      // }

      if (voice && typeof voice === "string") {
        const blob = await fetch(voice).then((res) => res.blob());
        formData.append("voice", blob, "recording.webm");
      }

      if (images && Array.isArray(images)) {
        images.forEach((file: File) => {
          formData.append("images", file); // All files will be appended with the same key
        });
      }

      const newChat: Record<string, any> = {
        senderId: user?._id,
        receiverId: !chat
          ? selectedUser?._id
          : chat.senderId?._id === user?._id
          ? chat.receiverId?._id
          : chat.senderId?._id,

        isSeen: false,
      };
      // Only include like if it's true (or whatever your condition is)
      if (like) {
        newChat.like = like;
      }

      // Only include text if it exists
      if (text?.trim()) {
        newChat.text = text.trim();
      }
      formData.append("data", JSON.stringify(newChat));

      socket?.emit("fetchMyChats", { senderId: user?._id });
      reset();
      // const { data } = await createChat(newChat).unwrap();
      // const { data } = await createChat(formData).unwrap();
      // dispatch(appendMessage({ key, message: data }));
      // setLoadingMessage(null);
      try {
        const { data } = await createChat(formData).unwrap();
        if (data) {
          setLoadingMessage(null);
          console.log({ data });
          console.log({ chat });

          // const senderId = getSenderId(data);
          const key = `${user?._id}_${
            !chat
              ? selectedUser?._id
              : chat.senderId?._id === user?._id
              ? chat.receiverId?._id
              : chat.senderId?._id
          }`;
          console.log({ key });

          // Rest of your logic...
          if ("messages" in data) {
            // Handle first message format
            dispatch(
              setChat({
                key,
                chat: { ...data },
              })
            );
          } else {
            // Handle single message format
            dispatch(
              appendMessage({
                key,
                message: data,
              })
            );
          }
        }
        // dispatch(setChat({ key, chat: chatData.data[0] }));
      } catch (error) {
        console.error("Message failed:", error);
      } finally {
        // Always clears after try/catch
      }
      // const { data } = await createChat(newChat).unwrap();
      // const { data } = await createChat(formData).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
      console.log({ error });
    }
  };

  return (
    <Drawer
      placement="bottom"
      shouldBlockScroll={false}
      // isOpen={isOpen}
      // onOpenChange={onOpenChange}
      isOpen={isChatDrawerOpen}
      onOpenChange={handleDrawerChange}
      size="md"
      backdrop="transparent"
      // className="w-[80%] md:w-[40%] lg:w-[23%] bottom-0 left-[10%] md:left-[50%] lg:left-[70%]"
      className="w-[90%] md:w-[40%] lg:w-[28%] bottom-0 left-[5%] md:left-[50%] lg:left-[70%]"
    >
      <DrawerContent>
        {() => (
          // {(onClose) => (
          <>
            <DrawerHeader className=" !pt-2 !pb-1 !px-2 ">
              <div className="text-start">{selectedUser?.user}</div>
            </DrawerHeader>

            <DrawerBody className="!px-2 ">
              <Message
                chat={chat as IChat}
                currentUserId={user?._id as string}
                skip={skip}
                isFetchingChatData={isFetchingChatData}
                createChatIsLoading={createChatIsLoading}
                handleNewMessageScroll={handleNewMessageScroll}
                hasMoreMessages={hasMoreMessages}
                loadingMessage={loadingMessage}
                isTypingState={isTypingState}
              />
            </DrawerBody>

            <DrawerFooter className=" !pt-0 !pb-2 !px-0 relative w-full mx-auto  ">
              <div className="w-full ">
                <MessageForm
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
