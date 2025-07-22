// components/ui/post/PostActions.tsx
import React from "react";
import { Button } from "@heroui/react";
import { FiMessageCircle } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";

import { IPost } from "@/type";
import DislikeButton from "./DislikeButton";
import LikeButton from "./LikeButton";

interface PostActionsProps {
  post: IPost;
  triggerDebouncedEmit: (postId: string) => void;
  modalCommentRef?: React.ReactNode;
  onCommentButtonClick: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  triggerDebouncedEmit,
  modalCommentRef,
  onCommentButtonClick,
}) => {
  return (
    <div className="w-full flex justify-between lg:pl-[10%] lg:pr-[10%]">
      <LikeButton
        post={post}
        onInteraction={() => triggerDebouncedEmit(post._id)}
      />
      <DislikeButton
        post={post}
        onInteraction={() => triggerDebouncedEmit(post._id)}
      />

      {!modalCommentRef ? (
        <Button
          fullWidth
          onClick={() => onCommentButtonClick(post?._id)}
          size="sm"
          variant="light"
          startContent={<FiMessageCircle size={24} />}
        >
          {post?.comments?.length}
        </Button>
      ) : (
        modalCommentRef
      )}

      <Button
        isDisabled
        fullWidth
        size="sm"
        variant="light"
        startContent={<PiShareFat size={24} />}
      ></Button>
    </div>
  );
};

export default PostActions;
