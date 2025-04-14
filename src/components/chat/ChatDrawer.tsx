import {
  useCreateChatMutation,
  useGetChatbyUserIdQuery,
} from "@/redux/features/chat/chatApi";
import { IChat } from "@/type";
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
import LinkUpTextarea from "../form/LinkUpTextarea";
import { IoSend } from "react-icons/io5";
import { useSocketContext } from "@/context/socketContext";
import { ISelectedUser } from "../common/UsersList";
import { useUser } from "@/context/UserProvider";
import { FormProvider, useForm } from "react-hook-form";
import ChatMessage from "./ChatMessage";

const ChatDrawer = ({
  selectedUser,
}: {
  selectedUser: ISelectedUser | null;
}) => {
  const { user } = useUser();
  const { socket } = useSocketContext();
  const methods = useForm();
  const { reset, watch } = methods;
  const [chat, setChat] = useState<IChat | null>(null);
  const [messageText, setMessageText] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isTypingState, setIsTypingState] = useState(false); // Renamed to avoid confusion

  const [createChat, { isLoading: createChatIsLoading }] =
    useCreateChatMutation();

  const currentText = watch("text");
  useEffect(() => {
    setMessageText(currentText);
  }, [currentText]);

  const { data: chatData, refetch: refetchChatData } = useGetChatbyUserIdQuery(
    {
      senderId: user?._id as string,
      receiverId: selectedUser?._id,
    },
    { skip: !user?._id || !selectedUser?._id }
  );

  useEffect(() => {
    if (chatData?.data) {
      setChat(chatData.data);
    }
  }, [chatData]);

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage: IChat) => {
      // setChat((prevChat) =>
      //   prevChat
      //     ? { ...prevChat, messages: [...(prevChat.messages || []), newMessage] }
      //     : { _id: 'temp', senderId: { _id: newMessage.senderId._id } as any, receiverId: { _id: user?._id } as any, messages: [newMessage] } as IChat
      // );
      if (!isOpen) {
        onOpen();
        setChat(null);
      }
      setChat(newMessage);
    };

    const handleUserTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === selectedUser._id) {
        setIsTypingState(true);
      }
    };

    const handleUserStoppedTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === selectedUser._id) {
        setIsTypingState(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, selectedUser, isOpen, onOpen, user?._id]);

  useEffect(() => {
    if (selectedUser?._id) {
      onOpen();
      setChat(null);
      refetchChatData();
    }
  }, [selectedUser?._id, onOpen, refetchChatData]);

  const emitTypingStart = () => {
    if (!isTypingState && selectedUser?._id && socket) {
      setIsTypingState(true);
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  const emitTypingStop = () => {
    if (isTypingState && selectedUser?._id && socket) {
      setIsTypingState(false);
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
  };

  useEffect(() => {
    if (!selectedUser?._id || !socket) return;

    let timeout: NodeJS.Timeout | null = null;

    const startTyping = () => {
      if (!isTypingState) {
        emitTypingStart();
        setIsTypingState(true);
      }
    };

    const stopTyping = () => {
      if (isTypingState) {
        emitTypingStop();
        setIsTypingState(false);
      }
    };

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        stopTyping();
      }, 2000);
    };

    if (currentText && currentText.trim().length > 0) {
      startTyping();
      resetTimer();
    } else {
      stopTyping();
      if (timeout) clearTimeout(timeout);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentText, selectedUser?._id, socket]);

  // const onSubmit = (data) => console.log(data);
  // const handleCreateChat = async (
  const onSubmit = async (data) => {
    if (!selectedUser) return;
    setMessageText(data.text);

    try {
      const newChat = {
        senderId: user?._id,
        // receiverId: selectedUser?._id,
        receiverId: !chat
          ? selectedUser?._id
          : chat.senderId === user?._id
          ? chat.receiverId
          : chat.senderId,
        text: data.text,
        imageUrl: "",
        videoUrl: "",
        isSeen: false,
      };

      await createChat(newChat).unwrap();
      reset();
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
        {(onClose) => (
          <>
            <DrawerHeader className=" !pt-2 !pb-1 ">
              <div className="text-start">{selectedUser?.user}</div>
            </DrawerHeader>

            <DrawerBody>
              <ChatMessage
                chat={chat as IChat}
                currentUserId={user?._id as string}
                isLoading={createChatIsLoading}
                messageText={messageText}
                isTypingState={isTypingState}
              />
            </DrawerBody>

            <DrawerFooter className=" !pt-1 !pb-2 relative ">
              <div>
                {isTypingState && !currentText && (
                  <div className="absolute -mt-5  text-gray-500 text-sm italic z-50 ">
                    Typing...
                  </div>
                )}
              </div>
              <div className="w-full">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <LinkUpTextarea
                      name="text"
                      size="sm"
                      placeholder="Aa"
                      minRows={1}
                      endContent={<IoSend />}
                    />
                  </form>
                </FormProvider>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
