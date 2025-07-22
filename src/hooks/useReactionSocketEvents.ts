// hooks/useReactionSocketEvents.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux"; // Assuming you'll use Redux dispatch within the hook
import { setReactions } from "@/redux/features/post/reactionSlice"; // Adjust path as needed
import { IPost, IUser } from "@/type"; // Adjust path as needed
import { Socket } from "socket.io-client"; // Assuming you have Socket type from 'socket.io-client'

interface UseReactionSocketEventsProps {
  socket: Socket | null;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>; // To update the local posts state
}

export const useReactionSocketEvents = ({
  socket,
  setPosts,
}: UseReactionSocketEventsProps) => {
  const dispatch = useDispatch(); // Use dispatch within the hook

  useEffect(() => {
    if (!socket) return;

    const handleUpdatedLikeDislike = (updatedLikeDislike: {
      _id: string;
      // Ensure 'likes' and 'dislikes' are arrays of 'IUser' in the socket event payload
      likes: IUser[];
      dislikes: IUser[];
    }) => {
      if (updatedLikeDislike) {
        dispatch(
          setReactions({
            postId: updatedLikeDislike._id,
            likes: updatedLikeDislike.likes
              .map((u) => u._id)
              .filter(Boolean) as string[], // Ensure u._id exists
            dislikes: updatedLikeDislike.dislikes
              .map((u) => u._id)
              .filter(Boolean) as string[], // Ensure u._id exists
          })
        );

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedLikeDislike._id
              ? {
                  ...post,
                  likes: updatedLikeDislike.likes,
                  dislikes: updatedLikeDislike.dislikes,
                }
              : post
          )
        );
      }
    };

    socket.on("updated-like-dislike", handleUpdatedLikeDislike);

    return () => {
      socket.off("updated-like-dislike", handleUpdatedLikeDislike);
    };
  }, [socket, dispatch, setPosts]);
};
