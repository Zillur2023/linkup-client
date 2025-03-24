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
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ChatDrawer from "../shared/ChatDrawer";

export const UserDropdown: React.FC<{ userData: IUser | null }> = ({
  userData,
}) => {
  if (!userData) {
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
          name={userData.name}
          size="sm"
          src={userData.profileImage}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{userData.email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          as={Link}
          href={`/profile?id=${userData?._id}`}
        >
          <div className="flex items-center space-x-2">
            <Avatar radius="full" size="sm" src={userData.profileImage} />
            <span>{userData.name}</span>
          </div>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const ChatDropdown: React.FC<{ userData: IUser }> = ({ userData }) => {
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    user: ReactNode;
  } | null>(null);
  // Use a Map to store the last chat for each unique senderId-receiverId pair
  const lastChatsMap = new Map();

  userData?.chats?.forEach((chat) => {
    // Create a sorted key to handle reverse pairs (e.g., user1-user2 and user2-user1)
    const key = [chat.senderId._id, chat.receiverId._id].sort().join("-");

    // If the key doesn't exist in the Map or the current chat is more recent, add/update it
    if (
      !lastChatsMap.has(key) ||
      new Date(String(chat.createdAt)) >
        new Date(lastChatsMap.get(key).createdAt)
    ) {
      lastChatsMap.set(key, chat);
    }
  });

  // Convert the Map values back into an array of last chats
  const lastChatsArray = Array.from(lastChatsMap.values());

  console.log({ lastChatsArray });
  // console.log("chatDropdown UserDta", userData)

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <MessageCircleMore size={36} />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          {lastChatsArray.map((item) => {
            const getUserComponent = (showContent?: boolean) => (
              <User
                avatarProps={{
                  src:
                    item.senderId._id === userData?._id
                      ? item.receiverId.profileImage
                      : item.senderId.profileImage,
                }}
                description={
                  showContent && item.content
                    ? item.senderId._id === userData?._id
                      ? `You: ${item.content}`
                      : item.content
                    : "Active now"
                }
                name={
                  item.senderId._id === userData?._id
                    ? item.receiverId.name
                    : item.senderId.name
                }
              />
            );
            return (
              <DropdownItem
                key={item._id}
                onPress={() =>
                  setSelectedUser({
                    _id:
                      item.senderId._id === userData?._id
                        ? item.receiverId._id
                        : item.senderId._id,
                    user: getUserComponent(),
                  })
                }
                className="h-14 gap-2"
              >
                {getUserComponent(true)}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      <ChatDrawer selectedUser={selectedUser} userData={userData} />
    </>
  );
};
