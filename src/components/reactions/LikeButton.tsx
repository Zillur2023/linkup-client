"use client";

import { useUser } from "@/context/UserProvider";
import { handleLike } from "@/redux/features/post/reactionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost } from "@/type";
import { useRouter } from "next/navigation";
import { BiLike, BiSolidLike } from "react-icons/bi";
import ReactionButton from "./ReactionButton";
import { useEffect, useRef } from "react";
import { useSocketContext } from "@/context/socketContext";

interface LikeButtonProps {
  post: IPost;
}

const LikeButton = ({ post }: LikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { socket } = useSocketContext();
  const dispatch = useAppDispatch();
  const reactions = useAppSelector((state: RootState) => state.reactions);
  const pendingPostIdRef = useRef<string | null>(null);

  // const requestQueue = useRef<Promise<any>>(Promise.resolve());

  console.log("reactions.likes[post._id]", reactions.likes[post._id]);
  const handlePostLike = () => {
    if (!user?._id) return router.push("/login");

    dispatch(handleLike({ postId: post._id, userId: user._id }));

    // Store the pending post ID in a ref (no re-render)
    pendingPostIdRef.current = post._id;
  };
  useEffect(() => {
    const postId = pendingPostIdRef.current;
    if (!postId) return;

    const updatedLikes = reactions.likes[postId];
    const updatedDislikes = reactions.dislikes[post._id];
    if (!updatedLikes) return;
    // socket?.emit("update-like-dislike", { postId: post._id, userId: user?._id });

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
      // .catch((err) => {
      //   toast.error("Failed to update like");
      //   console.error(err);
      // });

      // Clear the ref
      pendingPostIdRef.current = null;
    }, 2000);

    return () => clearTimeout(timeout);
  }, [reactions.likes, reactions.dislikes, post?._id, socket]);

  return (
    <ReactionButton
      reactionType="likes"
      post={post}
      onClick={handlePostLike}
      startContent={
        reactions.likes[post._id]?.includes(user?._id as string) ? (
          // post.likes?.some((like) => like?._id === user?._id) ? (
          <BiSolidLike size={24} className="text-blue-500" />
        ) : (
          <BiLike size={24} />
        )
      }
    >
      {reactions.likes[post._id]?.length}
      {/* {post.likes?.length} */}
    </ReactionButton>
  );
};

export default LikeButton;
