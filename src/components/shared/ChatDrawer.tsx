import { useCreateChatMutation } from "@/redux/features/chat/chatApi";
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
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpTextarea from "../form/LinkUpTextarea";
import { IoSend } from "react-icons/io5";
import { formatChatTooltipDate } from "@/uitls/formatDate";

export interface ISelectedUser {
  _id: string;
  label?: string;
  icon?: ReactNode;
  user: ReactNode;
}

const ChatMessages = ({
  messages,
  currentUserId,
}: {
  messages: IChat[];
  currentUserId: string;
}) => {
  return (
    <div className="space-y-1">
      {messages.map((msg: IChat, index, chatArray) => {
        const isLastFromSender =
          index === chatArray.length - 1 ||
          chatArray[index + 1]?.senderId?._id !== msg.senderId?._id;
        return (
          <div
            key={msg._id}
            className={`flex items-start ${
              msg.senderId?._id === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {isLastFromSender && msg.senderId?._id !== currentUserId && (
              <Tooltip content={msg?.senderId?.name} closeDelay={0}>
                <Avatar
                  className="w-10 h-10 mr-2"
                  src={msg.senderId.profileImage || "/default-avatar.png"}
                />
              </Tooltip>
            )}
            {!isLastFromSender && <div className="w-10 h-10 mr-2"></div>}
            <Tooltip
              content={formatChatTooltipDate(msg?.createdAt)}
              closeDelay={0}
            >
              <Card className={`p-3 max-w-xs rounded-xl shadow-md break-words`}>
                <p className="text-sm">{msg.content}</p>
              </Card>
            </Tooltip>
          </div>
        );
      })}
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createChat] = useCreateChatMutation();

  useEffect(() => {
    if (selectedUser) {
      onOpen();
    }
  }, [selectedUser, onOpen]);

  const handleCreateChat = async (data: any, reset?: () => void) => {
    try {
      const newChat = {
        ...data,
        senderId: user?._id,
        receiverId: selectedUser?._id,
        content: data.content,
      };
      await createChat(newChat).unwrap();
      reset?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
    }
  };

  const filteredChats = user?.chats?.filter(
    (msg) =>
      (msg.senderId?._id === user?._id &&
        msg.receiverId?._id === selectedUser?._id) ||
      (msg.receiverId?._id === user?._id &&
        msg.senderId?._id === selectedUser?._id)
  );

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
                messages={filteredChats || []}
                currentUserId={user?._id || ""}
              />
            </DrawerBody>
            <DrawerFooter>
              <div className="w-full">
                <LinkUpForm
                  onSubmit={(data, reset) => handleCreateChat(data, reset)}
                >
                  <LinkUpTextarea
                    name="content"
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
