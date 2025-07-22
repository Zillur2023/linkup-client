// components/ui/post/PostHeader.tsx
import React from "react";
import { Tooltip } from "@heroui/react";
import { PiCrown } from "react-icons/pi";
import Author from "@/components/shared/Author";
import LinkUpButton from "@/components/shared/LinkUpButton";
import ActionButton from "@/components/shared/ActionButton";
import { formatPostDate, formatPostTooltipDate } from "@/uitls/formatDate";
import { IPost, IUser } from "@/type";

interface PostHeaderProps {
  post: IPost;
  userData: IUser | undefined;
  handleUpdateFollowUnfollow: (id: string) => void;
  handleDelete: (postId: string) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  userData,
  handleUpdateFollowUnfollow,
  handleDelete,
}) => {
  return (
    <div className="w-full flex justify-between items-center relative">
      {post?.isPremium && (
        <div className="absolute top-14 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-10">
          <PiCrown size={16} />
          <span className="text-sm font-medium">Premium</span>
        </div>
      )}
      <Author
        author={post?.author}
        description={
          <Tooltip content={formatPostTooltipDate(post?.createdAt)}>
            {formatPostDate(post?.createdAt)}
          </Tooltip>
        }
      />
      <div className="flex items-center gap-3">
        {post?.author?._id !== userData?._id && (
          <LinkUpButton
            buttonId="followUnfollow"
            onClick={() =>
              handleUpdateFollowUnfollow(post?.author?._id as string)
            }
          >
            {userData?.following?.includes(post?.author?._id as string)
              ? "Unfollow"
              : "Follow"}
          </LinkUpButton>
        )}
        {post?.author?._id === userData?._id && (
          <ActionButton
            post={post}
            confirmDelete={() => handleDelete(post?._id)}
          />
        )}
      </div>
    </div>
  );
};

export default PostHeader;
