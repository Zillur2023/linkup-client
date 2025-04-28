import { IUser } from "@/type";
import { User } from "@heroui/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Link from "next/link";
import { ReactNode } from "react";
import { useSocketContext } from "@/context/socketContext";

interface AuthorProps {
  author: IUser;
  description?: ReactNode;
  className?: string; // Optional class for the author's name
}

export default function Author({
  author,
  description,
  className,
}: AuthorProps) {
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
    if (typeof description === "string") {
      return <p>{truncate(description, 40)}</p>;
    } else if (description) {
      return description;
    } else {
      return isOnline ? "Active now" : "Offline";
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
