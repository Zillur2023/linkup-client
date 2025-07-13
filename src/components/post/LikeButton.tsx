"use client";

import { useUser } from "@/context/UserProvider";
import { handleLike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiLike, BiSolidLike } from "react-icons/bi";
import ReactionButton from "./ReactionButton";

// LikeButton.tsx
interface LikeButtonProps {
  post: IPost;
  onInteraction?: () => void; // Simplified to just notify about interaction
}

const LikeButton = ({ post, onInteraction }: LikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const { likes } = useAppSelector((state: RootState) => state.reactions);

  const handlePostLike = () => {
    if (!user?._id) return router.push("/login");

    dispatch(handleLike({ postId: post._id, userId: user._id }));
    onInteraction?.();
  };

  return (
    <ReactionButton
      reactionType="likes"
      post={post}
      onClick={handlePostLike}
      startContent={
        likes[post._id]?.includes(user?._id as string) ? (
          // post.likes?.some((like) => like?._id === user?._id) ? (
          <BiSolidLike size={24} className="text-blue-500" />
        ) : (
          <BiLike size={24} />
        )
      }
    >
      {likes[post._id]?.length}
      {/* {post.likes?.length} */}
    </ReactionButton>
  );
};

export default LikeButton;
