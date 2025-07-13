"use client";

import { handleDislike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import ReactionButton from "./ReactionButton";
import { useUser } from "@/context/UserProvider";

// DislikeButton.tsx
interface DislikeButtonProps {
  post: IPost;
  onInteraction?: () => void; // Simplified to just notify about interaction
}

const DislikeButton = ({ post, onInteraction }: DislikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const { dislikes } = useAppSelector((state: RootState) => state.reactions);

  const handlePostDislike = () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

    dispatch(handleDislike({ postId: post._id, userId: user._id }));
    onInteraction?.();
  };

  return (
    <ReactionButton
      reactionType="dislikes"
      post={post}
      onClick={handlePostDislike}
      startContent={
        dislikes[post._id]?.includes(user?._id as string) ? (
          // post.dislikes?.some((dislike) => dislike?._id === user?._id) ? (
          <BiSolidDislike size={24} className="text-blue-500" />
        ) : (
          <BiDislike size={24} />
        )
      }
    >
      {dislikes[post._id]?.length}
      {/* {post.dislikes?.length} */}
    </ReactionButton>
  );
};

export default DislikeButton;
