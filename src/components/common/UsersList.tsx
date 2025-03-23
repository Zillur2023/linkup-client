import React, { ReactNode, useState } from "react";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userApi";
import { IChat, IUser, IUserData } from "@/type";
import {
  Avatar,
  Card,
  Listbox,
  ListboxItem,
  Tooltip,
  User,
} from "@heroui/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import LinkUpTextarea from "../form/LinkUpTextarea";
import LinkUpForm from "../form/LinkUpForm";
import { SendHorizontal } from "lucide-react";
import { useCreateChatMutation } from "@/redux/features/chat/chatApi";
import { toast } from "sonner";
import { useUser } from "@/context/UserProvider";

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
              content={new Date(String(msg?.createdAt)).toLocaleString()}
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

const UsersList = () => {
  interface ISelectedUser {
    _id: string;
    label: string;
    icon: ReactNode;
    user: ReactNode;
  }
  const [selectUser, setSelectUser] = useState<ISelectedUser>({
    _id: "",
    label: "",
    icon: null,
    user: null,
  });
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const [createChat] = useCreateChatMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    data: allUserData,
    isLoading,
    isError,
  } = useGetAllUserQuery({ searchQuery: "" });

  const filteredChats = userData?.data?.chats?.filter(
    (msg) =>
      (msg.senderId?._id === userData?.data?._id &&
        msg.receiverId?._id === selectUser?._id) ||
      (msg.receiverId?._id === userData?.data?._id &&
        msg.senderId?._id === selectUser?._id)
  );

  const handleCreateChat = async (data: any, reset?: () => void) => {
    try {
      const newChat = {
        ...data,
        senderId: userData?.data?._id,
        receiverId: selectUser?._id,
        content: data.content,
      };
      await createChat(newChat).unwrap();
      reset?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create comment");
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError || !allUserData?.data)
    return <div>Failed to load users. Please try again later.</div>;

  const items = allUserData?.data
    ?.filter((usr: IUser) => usr._id !== user?._id)
    ?.map((user: IUser) => ({
      _id: user._id,
      label: user.name,
      icon: (
        <Avatar className="w-6 h-6" src={user.profileImage} alt={user.name} />
      ),
      user: (
        <User
          avatarProps={{
            src: `${user.profileImage}`,
          }}
          description="Active now"
          name={user.name}
        />
      ),
    }));

  return (
    <>
      {allUserData?.data?.length - 1 === items.length && (
        <Listbox
          items={items}
          aria-label="User List"
          selectionMode="single"
          hideSelectedIcon
          autoFocus
        >
          {(item: any) => (
            <ListboxItem
              key={item._id}
              onPress={() => {
                setSelectUser(item);
                onOpen();
              }}
              startContent={item.icon}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      )}
      <div className="hidden md:block  ">
        <Drawer
          placement="bottom"
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="md"
          backdrop="transparent"
          className="w-[23%] bottom-0 left-[70%]"
          //   className=" w-[300px] md:w-[350px] bottom-0 md:left-[60%]  lg:left-[68%]"
          //   className=" w-[350px]   bottom-0 left-[calc(100vw-330px)] md:left-[calc(100vw-400px)] lg:left-[calc(100vw-480px)] "
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  <div className="  text-start">{selectUser?.user}</div>
                </DrawerHeader>
                <DrawerBody>
                  <ChatMessages
                    messages={filteredChats || []}
                    currentUserId={userData?.data?._id || ""}
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
                        endContent={<SendHorizontal />}
                        onSubmit={handleCreateChat}
                      />
                    </LinkUpForm>
                  </div>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default UsersList;
