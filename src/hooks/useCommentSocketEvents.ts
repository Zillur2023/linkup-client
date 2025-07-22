// hooks/useCommentSocketEvents.ts
import { useEffect } from "react";
import { IComment, IPost, IUser } from "@/type"; // Adjust path as needed
import { Socket } from "socket.io-client"; // Assuming you have Socket type from 'socket.io-client'
import { useUser } from "@/context/UserProvider";

// If you're using Redux for posts, you might pass dispatch and a selector for posts
// For this example, let's assume `setPosts` is passed directly for simplicity,
// or if you're using a global state manager like Recoil/Zustand, you'd update that state.

interface UseCommentSocketEventsProps {
  socket: Socket | null;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

export const useCommentSocketEvents = ({
  socket,
  setPosts,
}: UseCommentSocketEventsProps) => {
  const { user } = useUser();
  useEffect(() => {
    if (!socket || !user) return;

    // You can optionally type this inline or reuse TCommentWithStatus
    type TCommentWithStatus = IComment & { isDeleted?: boolean };

    const handleNewComment = (comment: TCommentWithStatus) => {
      const { isDeleted, ...cleanComment } = comment;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== cleanComment.postId) return post;

          const existingIndex = post.comments.findIndex(
            (c) => c._id === cleanComment._id
          );

          let updatedComments;

          if (isDeleted) {
            updatedComments = post.comments.filter(
              (c) => c._id !== cleanComment._id
            );
          } else if (existingIndex !== -1) {
            updatedComments = [...post.comments];
            updatedComments[existingIndex] = cleanComment;
          } else {
            updatedComments = [cleanComment, ...post.comments];
          }

          return { ...post, comments: updatedComments };
        })
      );
    };

    const handleAddedComment = (newComment: IComment) => {
      console.log({ newComment });
      handleNewComment(newComment);
    };

    const handleUpdatedComment = (updatedComment: IComment) => {
      console.log({ updatedComment });
      handleNewComment(updatedComment);
    };

    const handleDeletedComment = (deletedComment: IComment) => {
      console.log({ deletedComment });
      handleNewComment({ ...deletedComment, isDeleted: true });
    };

    socket.on("addedComment", handleAddedComment);
    socket.on("updatedComment", handleUpdatedComment);
    socket.on("deletedComment", handleDeletedComment);

    return () => {
      socket.off("addedComment", handleAddedComment);
      socket.off("updatedComment", handleUpdatedComment);
      socket.off("deletedComment", handleDeletedComment);
    };
  }, [socket, user, setPosts]);
};
