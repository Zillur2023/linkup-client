import { IUser } from "@/type";
import { User } from "@heroui/react";
import { VerifiedIcon } from "lucide-react";

interface AuthorProps {
  author: IUser;
  className?: string; // Optional class for the author's name
}

export default function Author({ author, className }: AuthorProps) {
  return (
    <User
      name={
        <span className="flex items-center gap-2">
          <span className={`whitespace-nowrap ${className}`}>
            {author?.name}
          </span>
          {author?.isVerified && (
            <VerifiedIcon className="w-5 h-5 text-blue-500" />
          )}
        </span>
      }
      description={<p className="text-blue-500">{author?.email}</p>}
      avatarProps={{
        src: `${author?.profileImage}`,
      }}
    />
  );
}
