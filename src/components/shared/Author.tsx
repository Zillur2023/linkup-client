import { IUser } from "@/type";
import { User } from "@heroui/react";
import { VerifiedIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

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
  return (
    <User
      name={
        <Link className=" hover:underline" href={`/profile?id=${author?._id}`}>
          <span className="flex items-center gap-2">
            <span className={`whitespace-nowrap font-semibold ${className}`}>
              {author?.name}
            </span>
            {author?.isVerified && (
              <VerifiedIcon className="w-5 h-5 text-blue-500" />
            )}
          </span>
        </Link>
      }
      description={
        description ? (
          description
        ) : (
          <p className="text-blue-500">{author?.email}</p>
        )
      }
      avatarProps={{
        src: `${author?.profileImage}`,
        // as: Link,
        // href: `/profile?id=${author?._id}`,
      }}
    ></User>
  );
}
