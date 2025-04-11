import {
  useCreateChatMutation,
  useGetChatbyUserIdQuery,
} from "@/redux/features/chat/chatApi";
import { IChat, IUser } from "@/type";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Tooltip,
  Avatar,
  Card,
} from "@heroui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpTextarea from "../form/LinkUpTextarea";
import { IoSend } from "react-icons/io5";
import { formatChatTooltipDate } from "@/uitls/formatDate";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { useUser } from "@/context/UserProvider";
import { useSocketContext } from "@/context/socketContext";

export interface ISelectedUser {
  _id: string;
  label?: string;
  icon?: ReactNode;
  user: ReactNode;
}

const ChatMessages = ({
  messages,
  currentUserId,
  createChatIsLoading,
  messageText,
}: {
  messages: any;
  currentUserId: string;
  createChatIsLoading: any;
  messageText: string;
}) => {
  console.log({ messages });
  const { socket } = useSocketContext();
  const { user } = useUser();
  const { data: userData, isFetching } = useGetUserByIdQuery(
    user?._id as string,
    {
      skip: !user?._id,
    }
  );
  console.log({ userData });
  console.log({ isFetching });
  console.log({ messages });
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [lastReceivedMessage, setlastReceivedMessage] = useState([]);
  console.log({ lastReceivedMessage });

  // const zillurMessage = lastReceivedMessage?.messages?.length
  //   ? lastReceivedMessage?.messages
  //   : messages?.messages;
  const zillurMessage = lastReceivedMessage?.messages;

  console.log({ zillurMessage });

  // ✅ Listen for new messages from the server
  useEffect(() => {
    if (!socket) return;

    // const handleNewMessage = (newMessage: any) => {
    //   console.log("📩 New message received:", newMessage);
    //   // setlastReceivedMessage ((prev) => [...prev, newMessage]);
    //   setlastReceivedMessage(newMessage);
    // };
    // const handleNewMessage = (messages: any) => {
    //   console.log("📩 New message received:", messages);
    //   // setlastReceivedMessage ((prev) => [...prev, newMessage]);
    //   setlastReceivedMessage(messages);
    // };

    // socket.on("newMessage", handleNewMessage);
    socket.on("newMessage", (newMessage) => {
      console.log("message data", newMessage);
      setlastReceivedMessage(newMessage);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("newMessage");
    };
  }, [socket, lastReceivedMessage, setlastReceivedMessage]);
  // Scroll to the bottom whenever the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger on messages update;
  return (
    <div className="space-y-1">
      {/* {messages?.map((msg) => { */}
      {zillurMessage?.map((msg) => {
        return (
          <div
            key={msg._id}
            className={`flex items-start 
              ${msg?.senderId === user?._id ? "justify-end" : "justify-start"}
            `}
          >
            {msg.senderId !== user?._id && (
              <Tooltip content={msg?.name} closeDelay={0}>
                <Avatar
                  className="w-10 h-10 mr-2"
                  src={msg?.profileImage || "/default-avatar.png"}
                />
              </Tooltip>
            )}
            {/* {<div className="w-10 h-10 mr-2"></div>} */}
            <Tooltip
              // content={formatChatTooltipDate(msg?.createdAt)}
              content={"zillur"}
              closeDelay={0}
            >
              <Card
                className={`p-3  break-words
                   ${
                     msg?.senderId === user?._id
                       ? "bg-blue-600 text-white"
                       : "bg-default-200 text-black"
                   }
                `}
              >
                {/* <p className="text-sm">{msg?.messages}</p> */}
                {/* <p className="text-sm">{msg?.lastMsg?.text}</p> */}
                <p className="text-sm">{msg?.text}</p>
              </Card>
            </Tooltip>
          </div>
        );
      })}
      {lastReceivedMessage && (
        <div className="flex items-start justify-start ">
          <div>
            <Card className="p-3 bg-default-200 text-white break-words ">
              <p className="text-sm ">{lastReceivedMessage ? "zillur" : ""}</p>
            </Card>
          </div>
        </div>
      )}
      {/* 👇 Show the current typing message as a preview */}
      {messageText && (createChatIsLoading || isFetching) && (
        <div className="flex items-start justify-end ">
          <div>
            <Card className="p-3 bg-blue-600 text-white break-words ">
              <p className="text-sm ">{messageText}</p>
            </Card>
            {(createChatIsLoading || isFetching) && (
              <p className=" text-xs">Sending...</p>
            )}
          </div>
        </div>
      )}
      {/* Invisible div to trigger scrolling to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

const ChatDrawer = ({
  selectedUser,
  user,
}: {
  selectedUser: ISelectedUser | null;
  user: IUser;
}) => {
  console.log({ selectedUser });
  const [messageText, setMessageText] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createChat, { isLoading: createChatIsLoading }] =
    useCreateChatMutation();
  const { data: chatData, refetch: refetchChatData } = useGetChatbyUserIdQuery(
    {
      senderId: user?._id as string,
      receiverId: selectedUser?._id as string,
    },
    { skip: !user?._id || !selectedUser?._id }
  );

  console.log({ chatData });

  useEffect(() => {
    if (selectedUser) {
      onOpen();
      refetchChatData();
    }
  }, [selectedUser, onOpen]);

  const handleCreateChat = async (data: any, reset?: () => void) => {
    setMessageText(data?.text);

    try {
      // const newChat = {
      //   ...data,
      //   senderId: user?._id,
      //   receiverId: selectedUser?._id,
      //   content: data.content,
      // };
      const newChat = {
        senderId: user?._id,
        receiverId: selectedUser?._id,
        text: data?.text,
        imageUrl: "",
        videoUrl: "",
        isSeen: false,
      };
      await createChat(newChat).unwrap();
      reset?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
    }
  };

  return (
    <Drawer
      placement="bottom"
      shouldBlockScroll={false}
      // isDismissable={false}
      // isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      backdrop="transparent"
      className="w-[80%] md:w-[40%] lg:w-[23%] bottom-0 left-[10%] md:left-[50%] lg:left-[70%]"
    >
      <DrawerContent>
        {/* {(onClose) => ( */}
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <div className="text-start">{selectedUser?.user}</div>
            </DrawerHeader>
            <DrawerBody>
              <ChatMessages
                messages={chatData?.data || []}
                // messages={[]}
                // selectedUser={selectedUser}
                currentUserId={user?._id || ""}
                createChatIsLoading={createChatIsLoading}
                messageText={messageText}
              />
            </DrawerBody>
            <DrawerFooter>
              <div className="w-full">
                <LinkUpForm
                  onSubmit={(data, reset) => handleCreateChat(data, reset)}
                >
                  <LinkUpTextarea
                    name="text"
                    size="sm"
                    placeholder="Aa"
                    minRows={1}
                    endContent={<IoSend />}
                    onSubmit={handleCreateChat}
                  />
                </LinkUpForm>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
