"use client";

import { handleDislike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import ReactionButton from "./ReactionButton";
import { useUser } from "@/context/UserProvider";
import { useEffect, useRef } from "react";
import { useSocketContext } from "@/context/socketContext";

interface DislikeButtonProps {
  post: IPost;
}

const DislikeButton = ({ post }: DislikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { socket } = useSocketContext();
  const dispatch = useAppDispatch();
  const reactions = useAppSelector((state: RootState) => state.reactions);
  const pendingDislikePostIdRef = useRef<string | null>(null);

  // 🟢 useRef for request queue
  // const requestQueue = useRef<Promise<any>>(Promise.resolve());

  const handlePostDislike = () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

    // socket?.emit("update-like-dislike", { postId: post._id, userId: user._id });

    dispatch(handleDislike({ postId: post._id, userId: user._id }));

    pendingDislikePostIdRef.current = post._id;
  };

  useEffect(() => {
    const postId = pendingDislikePostIdRef.current;
    if (!postId) return;

    const updatedLikes = reactions.likes[postId];
    const updatedDislikes = reactions.dislikes[post._id];
    if (!updatedDislikes) return;

    const timeout = setTimeout(() => {
      socket?.emit("update-like-dislike", {
        postId,
        likes: updatedLikes,
        dislikes: updatedDislikes,
      });

      // updateLike({
      //   postId,
      //   likes: updatedLikes,
      //   dislikes: updatedDislikes,
      // })
      //   .unwrap()
      //   .catch((err) => {
      //     toast.error("Failed to update dislike");
      //     console.error(err);
      //   });

      pendingDislikePostIdRef.current = null;
    }, 2000);

    return () => clearTimeout(timeout);
  }, [reactions.likes, reactions.dislikes, post?._id, socket]);

  return (
    <ReactionButton
      reactionType="dislikes"
      post={post}
      onClick={handlePostDislike}
      startContent={
        reactions.dislikes[post._id]?.includes(user?._id as string) ? (
          // post.dislikes?.some((dislike) => dislike?._id === user?._id) ? (
          <BiSolidDislike size={24} className="text-blue-500" />
        ) : (
          <BiDislike size={24} />
        )
      }
    >
      {reactions.dislikes[post._id]?.length}
      {/* {post.dislikes?.length} */}
    </ReactionButton>
  );
};

export default DislikeButton;
