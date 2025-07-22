import { IUser } from "@/type";
import { User } from "@heroui/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Link from "next/link";
import { useSocketContext } from "@/context/socketContext";
import image from "../../../public/likeButton.png";
import Image from "next/image";
import { useUser } from "@/context/UserProvider";

interface AuthorProps {
  author: IUser;
  description?: any;
  className?: string; // Optional class for the author's name
}

export default function Author({
  author,
  description,
  className,
}: AuthorProps) {
  const { user } = useUser();
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers?.includes(author?._id as string);

  // Helper to truncate string
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const renderName = (
    <Link href={`/profile?id=${author?._id}`} className="hover:underline">
      <span className="flex items-center gap-2">
        <span className={`whitespace-nowrap font-semibold ${className}`}>
          {author?.name}
        </span>
        {author?.isVerified && (
          <RiVerifiedBadgeFill className="w-5 h-5 text-blue-500" />
        )}
      </span>
    </Link>
  );

  const renderDescription = () => {
    if (description?.text) {
      return (
        <p>
          {user?._id === description?.senderId?._id
            ? `You: ${truncate(description?.text, 40)}`
            : truncate(description?.text, 40)}
        </p>
      );
    } else if (description?.voice) {
      return (
        <p>
          {user?._id === description?.senderId?._id
            ? "You"
            : description?.senderId?.name}{" "}
          send a voice
        </p>
      );
    } else if (description?.images) {
      return (
        <p>
          {user?._id === description?.senderId?._id
            ? "You"
            : description?.senderId?.name}{" "}
          send {description?.images?.length > 1 ? "images" : "a image"}
        </p>
      );
    } else if (description?.like) {
      return (
        <div className="flex items-center gap-1">
          <span>{user?._id === description?.senderId?._id ? "You:" : ""}</span>

          <Image
            src={image}
            width={16}
            height={16}
            alt="Like reaction"
            className="inline-block"
          />
        </div>
      );
    }
  };

  const userContent = (
    <User
      name={renderName}
      description={renderDescription()}
      avatarProps={{
        src: author?.profileImage || "",
      }}
    />
  );

  return isOnline ? (
    <div className="relative inline-block">
      {userContent}
      <span className="absolute bottom-4 left-6 transform translate-x-1/2 translate-y-1/2 bg-green-500 rounded-full w-3 h-3 border border-white" />
    </div>
  ) : (
    userContent
  );
}
