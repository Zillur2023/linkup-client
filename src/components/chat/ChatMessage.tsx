import { IChat } from "@/type";
import { formatChatTooltipDate } from "@/uitls/formatDate";
import { Avatar, Card, Tooltip } from "@heroui/react";
import { useEffect, useRef } from "react";

const ChatMessage = ({
  chat,
  currentUserId,
  isLoading,
  messageText,
}: {
  chat: IChat;
  currentUserId: string;
  isLoading: boolean;
  messageText: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, messageText]);

  return (
    <div className="space-y-1">
      {chat?.messages?.map((msg, index) => (
        <div
          // key={msg._id}
          key={index}
          className={`flex items-start ${
            msg.senderId._id === currentUserId ? "justify-end" : "justify-start"
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
      {isLoading && messageText && (
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
  );
};

export default ChatMessage;
