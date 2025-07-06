import { IChat, IMessage, TMessage } from "@/type";
import {
  formatChatTooltipDate,
  formatLastSentMessage,
} from "@/uitls/formatDate";
import { Avatar, Card, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useRef } from "react";
import image from "../../../public/likeButton.png";
import Image from "next/image";
import { ImageGallery } from "../shared/ImageGallery";
import ChatMessageImages from "./ChatMessageImages ";

const ChatMessage = ({
  chat,
  currentUserId,
  skip,
  isFetchingChatData,
  createChatIsLoading,
  handleNewMessageScroll,
  hasMoreMessages,
  loadingMessage,
  isTypingState,
}: {
  chat: IChat;
  currentUserId: string;
  skip: any;
  isFetchingChatData: any;
  createChatIsLoading: boolean;
  handleNewMessageScroll: any;
  hasMoreMessages: any;
  loadingMessage: TMessage | null;
  isTypingState: any;
}) => {
  // console.log("chat?.messages", chat?.messages);
  // console.log({ loadingMessage });
  const lastMessage = chat?.messages.at(-1);
  const isLastMessageSentByCurrentUser =
    lastMessage?.senderId?._id === currentUserId;
  const typingUserName =
    chat?.receiverId?._id === currentUserId
      ? chat?.senderId?.name
      : chat?.receiverId?.name;
  const typingUserProfile =
    chat?.receiverId?._id === currentUserId
      ? chat?.senderId?.profileImage
      : chat?.receiverId?.profileImage;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // When sending a message, scroll to bottom
  useEffect(() => {
    if (!scrollContainerRef.current || !messagesEndRef.current) return;

    if (loadingMessage && createChatIsLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingMessage, createChatIsLoading]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!scrollContainerRef.current || !messagesEndRef.current) return;

    if (
      !loadingMessage &&
      !createChatIsLoading &&
      hasMoreMessages &&
      !isFetchingChatData &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;

      // if (chat?.messages?.length > 10) {
      if (skip > 0) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: 400,
              behavior: "smooth",
            });
          }
        }, 0);
        // scrollContainerRef.current.scrollTo({
        //   top: 400,
        //   behavior: "smooth",
        // });
      } else {
        // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }

    if (isFetchingChatData) {
      hasFetchedRef.current = false;
    }
  }, [isFetchingChatData]);

  const isPureEmojiString = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    // Remove all valid emoji characters and whitespace
    // If anything remains, it's not a pure emoji string
    const cleaned = trimmed.replace(
      /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\u200d\ufe0f\s]/gu,
      ""
    );

    return cleaned.length === 0;
  };

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
        {hasMoreMessages && isFetchingChatData && (
          <Spinner className=" w-full text-center" />
        )}
        {chat?.messages?.map((msg: IMessage, index) => {
          return (
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
                <div className="space-y-1">
                  {msg.text &&
                    (isPureEmojiString(msg?.text) ? (
                      <div className={` break-words   `}>
                        {/* <p className="text-sm">{msg.text}</p> */}
                        <p className="text-3xl">{msg.text}</p>
                      </div>
                    ) : (
                      <Card
                        className={`p-3 break-words ${
                          msg.senderId._id === currentUserId
                            ? "bg-blue-600 text-white"
                            : "bg-default-200 text-black"
                        }`}
                      >
                        {/* <p className="text-sm">{msg.text}</p> */}
                        <p className="text-sm">{msg.text}</p>
                      </Card>
                    ))}
                  {msg.voice && (
                    <audio
                      key={msg.voice} // ensures re-render if the URL changes
                      controls
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        // This ensures that metadata (duration) is available before playback
                        const audio = e.currentTarget;
                        if (
                          audio.duration === Infinity ||
                          isNaN(audio.duration)
                        ) {
                          // Optional fallback handling
                          audio.currentTime = 1e101;
                          audio.ontimeupdate = () => {
                            audio.ontimeupdate = null;
                            audio.currentTime = 0;
                          };
                        }
                      }}
                    >
                      <source src={msg.voice} type="audio/mpeg" className=" " />
                    </audio>
                  )}
                  {/* {msg?.images &&
                    msg.images
                      // .filter((image) => image && image.trim() !== "") // Add this filter
                      .map((image, i) => (
                        <Image
                          key={i}
                          src={image}
                          width={50}
                          height={50}
                          alt="Picture of the author"
                          className=""
                        />
                      ))} */}

                  {/* {msg?.images && <ImageGallery images={msg?.images} />} */}
                  {msg?.images && (
                    <ChatMessageImages
                      images={msg.images}
                      // isCurrentUser={msg.senderId._id === currentUserId}
                    />
                  )}
                  {msg?.like && (
                    <Image
                      src={image}
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="  "
                    />
                  )}
                </div>
              </Tooltip>
            </div>
          );
        })}

        {isTypingState && (
          <div className="flex items-start justify-start">
            <Tooltip content={typingUserName} closeDelay={0}>
              <Avatar className="w-10 h-10 mr-1" src={typingUserProfile} />
            </Tooltip>
            <Card className="p-3 bg-default-200 text-black">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </Card>
          </div>
        )}

        {/* Message being sent indicator */}
        {createChatIsLoading || loadingMessage ? (
          <div className="flex items-start justify-end">
            <div>
              {loadingMessage?.text &&
                (isPureEmojiString(loadingMessage?.text) ? (
                  <div className={` break-words `}>
                    {/* <p className="text-sm">{msg.text}</p> */}
                    <p className="text-3xl">{loadingMessage.text}</p>
                  </div>
                ) : (
                  <Card className={`p-3 break-words bg-blue-600 }`}>
                    {/* <p className="text-sm">{msg.text}</p> */}
                    <p className="text-sm text-white">{loadingMessage.text}</p>
                  </Card>
                ))}
              {loadingMessage?.voice && <audio controls />}
              {/* {loadingMessage?.voice && (
                <audio src={loadingMessage.voice} controls />
              )} */}
              {loadingMessage?.images && (
                <div
                  onLoad={() =>
                    messagesEndRef.current?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <ChatMessageImages
                    images={loadingMessage.images}
                    // isCurrentUser={msg.senderId._id === currentUserId}
                  />
                </div>
                // <Image
                //   src={image}
                //   width={500}
                //   height={500}
                //   alt="Picture of the author"
                //   className="  "
                // />
              )}
              {loadingMessage?.like && (
                <Image
                  src={image}
                  width={500}
                  height={500}
                  alt="Picture of the author"
                  className="  "
                />
              )}

              <p className="text-xs">Sending...</p>
            </div>
          </div>
        ) : (
          isLastMessageSentByCurrentUser &&
          lastMessage?.createdAt && (
            <p className="text-xs text-right mr-1">
              sent {formatLastSentMessage(lastMessage.createdAt)}
            </p>
          )
        )}
        {/* <Image
          src={image}
          width={500}
          height={500}
          alt="Picture of the author"
        /> */}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessage;
