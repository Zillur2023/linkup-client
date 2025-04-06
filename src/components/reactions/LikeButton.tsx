"use client";

import { useUser } from "@/context/UserProvider";
import { useUpdateLikesMutation } from "@/redux/features/post/postApi";
import { handleLike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { toast } from "sonner";
import ReactionButton from "./ReactionButton";
import { useRef } from "react";

interface LikeButtonProps {
  post: IPost;
}

const LikeButton = ({ post }: LikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const [updateLike] = useUpdateLikesMutation();
  const reactions = useAppSelector((state: RootState) => state.reactions);

  const requestQueue = useRef<Promise<any>>(Promise.resolve());

  const handlePostLike = () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

    // Instant UI update
    dispatch(handleLike({ postId: post._id, userId: user._id }));

    // Queue the API requests
    requestQueue.current = requestQueue.current
      .then(async () => {
        await updateLike({
          userId: user._id,
          postId: post._id,
        }).unwrap();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update like");
      });
  };

  return (
    <ReactionButton
      reactionType="likes"
      post={post}
      onClick={handlePostLike}
      startContent={
        reactions.likes[post._id]?.includes(user?._id as string) ? (
          <BiSolidLike size={24} className="text-blue-500" />
        ) : (
          <BiLike size={24} />
        )
      }
    >
      {reactions.likes[post._id]?.length}
    </ReactionButton>
  );
};

export default LikeButton;
