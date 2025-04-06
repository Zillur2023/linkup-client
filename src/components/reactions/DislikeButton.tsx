"use client";

import { useUpdateDislikesMutation } from "@/redux/features/post/postApi";
import { handleDislike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import ReactionButton from "./ReactionButton";
import { toast } from "sonner";
import { useUser } from "@/context/UserProvider";
import { useRef } from "react";

interface DislikeButtonProps {
  post: IPost;
}

const DislikeButton = ({ post }: DislikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const [updateDislike] = useUpdateDislikesMutation();
  const reactions = useAppSelector((state: RootState) => state.reactions);

  // 🟢 useRef for request queue
  const requestQueue = useRef<Promise<any>>(Promise.resolve());

  const handlePostDislike = async () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

    // Optimistic UI update
    dispatch(handleDislike({ postId: post._id, userId: user._id }));

    // Queue the API requests
    requestQueue.current = requestQueue.current
      .then(async () => {
        await updateDislike({
          userId: user._id,
          postId: post._id,
        }).unwrap();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update dislike");
      });
  };

  return (
    <ReactionButton
      reactionType="dislikes"
      post={post}
      onClick={handlePostDislike}
      startContent={
        reactions.dislikes[post._id]?.includes(user?._id as string) ? (
          <BiSolidDislike size={24} className="text-blue-500" />
        ) : (
          <BiDislike size={24} />
        )
      }
    >
      {reactions.dislikes[post._id]?.length}
    </ReactionButton>
  );
};

export default DislikeButton;
