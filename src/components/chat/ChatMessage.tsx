import { IChat } from "@/type";
import { formatChatTooltipDate } from "@/uitls/formatDate";
import { Avatar, Card, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

const ChatMessage = ({
  chat,
  selectedUserKey,
  currentUserId,
  createChatIsLoading,
  handleNewMessageScroll,
  chatDataIsFetching,
  hasMoreMessage,
  messageText,
}: {
  chat: IChat;
  selectedUserKey: any;
  currentUserId: string;
  createChatIsLoading: boolean;
  handleNewMessageScroll: any;
  chatDataIsFetching: any;
  hasMoreMessage: any;
  messageText: string;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("chat?.messages?.length", chat?.messages?.length);

  // When sending a message, scroll to bottom
  useEffect(() => {
    if (!scrollContainerRef.current || !messagesEndRef.current) return;

    if (messageText && createChatIsLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      console.log("ZILLUR 1");
    }
  }, [messageText, createChatIsLoading]);

  // When fetching old messages, adjust scroll
  useEffect(() => {
    if (!scrollContainerRef.current || !messagesEndRef.current) return;

    if (
      !messageText &&
      !createChatIsLoading &&
      hasMoreMessage &&
      chat?.messages?.length > 10
    ) {
      scrollContainerRef.current.scrollTo({
        top: 400,
        behavior: "smooth",
      });
      console.log("ZILLUR 2");
    } else if (!messageText && !createChatIsLoading && hasMoreMessage) {
      // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1);
      console.log("ZILLUR 3");
    }
  }, [hasMoreMessage, chatDataIsFetching, chat?.messages.length]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    if (selectedUserKey) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      console.log("ZILLUR 4");
    }
  }, [selectedUserKey]);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleNewMessageScroll}
      style={{
        height: "500px",
        overflowY: "auto",
        // border: "1px solid gray",
        padding: "3px",
      }}
    >
      <div className="space-y-1">
        {hasMoreMessage && chatDataIsFetching && (
          <Spinner className=" w-full text-center" />
        )}
        {chat?.messages?.map((msg, index) => (
          <div
            // key={msg._id}
            key={index}
            className={`flex items-start ${
              msg.senderId._id === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.senderId._id !== currentUserId && (
              <Tooltip content={msg.senderId.name} closeDelay={0}>
                <Avatar
                  className="w-10 h-10 mr-1"
                  src={msg.senderId.profileImage || "/default-avatar.png"}
                />
              </Tooltip>
            )}

            <Tooltip
              content={formatChatTooltipDate(msg.createdAt)}
              closeDelay={0}
            >
              <Card
                className={`p-3 break-words ${
                  msg.senderId._id === currentUserId
                    ? "bg-blue-600 text-white"
                    : "bg-default-200 text-black"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </Card>
            </Tooltip>
          </div>
        ))}

        {/* Message being sent indicator */}
        {createChatIsLoading && messageText && (
          <div className="flex items-start justify-end">
            <div>
              <Card className="p-3 bg-blue-600 text-white break-words">
                <p className="text-sm">{messageText}</p>
              </Card>
              <p className="text-xs">Sending...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessage;
