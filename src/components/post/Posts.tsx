// components/Posts.tsx
"use client";

import { useEffect, useState } from "react";
import { Avatar, Card } from "@heroui/react";
import { useUser } from "@/context/UserProvider";
import {
  useGetUserByIdQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import { IComment, IPost, IUser } from "@/type"; // Ensure these types are correctly defined
import {
  useDeletePostMutation,
  useGetAllPostQuery,
} from "@/redux/features/post/postApi";
import { toast } from "sonner";
import { PostSkeleton } from "../shared/Skeleton";
import PostEditor from "./PostEditor";
import { useAppDispatch } from "@/redux/hooks"; // Ensure this hook is correctly typed and exported
import { setReactions } from "@/redux/features/post/reactionSlice"; // Ensure this slice and reducer exist
import { useSocketContext } from "@/context/socketContext"; // Ensure SocketContext is correctly implemented and provided
import { useDebouncedReactions } from "@/hooks/useDebouncedReactions "; // Ensure this hook is correctly implemented
import PostCard from "./PostCard"; // Ensure this component exists and accepts its props
import { useRouter } from "next/navigation";
import { useCommentSocketEvents } from "@/hooks/useCommentSocketEvents";
import { useReactionSocketEvents } from "@/hooks/useReactionSocketEvents";

interface PostsProps {
  commentPost?: IPost;
  userId?: string;
  showAllComments?: boolean;
  searchQuery?: string;
  modalCommentRef?: React.ReactNode;
}

const Posts = ({
  commentPost,
  userId,
  showAllComments = false,
  searchQuery,
  modalCommentRef,
}: PostsProps) => {
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();
  const { triggerDebouncedEmit } = useDebouncedReactions();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const queryPost = {
    userId,
    searchQuery,
    isPremium: userData?.data?.isVerified ? true : undefined,
  };
  // FIX: Corrected destructuring syntax here
  const { data: postData } = useGetAllPostQuery(queryPost);

  const [posts, setPosts] = useState<IPost[]>([]);

  useReactionSocketEvents({ socket, setPosts });
  useCommentSocketEvents({ socket, setPosts });

  // Effect to set initial posts data
  useEffect(() => {
    if (postData?.data) {
      setPosts(postData?.data);
    }
  }, [postData?.data]); // Changed dependency to postData?.data itself for better reactivity

  // Effect to handle single commentPost prop (e.g., when viewing a specific post for comments)
  useEffect(() => {
    if (commentPost) {
      setPosts([commentPost]);
    }
  }, [commentPost]);

  // Effect to initialize reactions for existing posts when they are first loaded
  useEffect(() => {
    if (!postData?.data) return;

    // Use a small timeout to ensure Redux store is ready or avoid blocking initial render
    const timeout = setTimeout(() => {
      postData.data.forEach((post) => {
        dispatch(
          setReactions({
            postId: post._id,
            likes: post.likes.map((u) => u._id).filter(Boolean) as string[],
            dislikes: post.dislikes
              .map((u) => u._id)
              .filter(Boolean) as string[],
          })
        );
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [postData?.data, dispatch]);

  // Handler for following/unfollowing users (passed to PostCard)
  const handleUpdateFollowUnfollow = async (id: string) => {
    if (!userData?.data?._id) {
      router.push("/login"); // Redirect if user is not logged in
      return;
    }
    try {
      await updateFollowUnfollow({
        targetId: id,
        loginUserId: userData?.data?._id,
      }).unwrap();
      toast.success("Follow status updated!"); // User feedback
    } catch (error: any) {
      console.error("Failed to update follow status:", error);
      toast.error(error?.data?.message || "Failed to update follow status.");
    }
  };

  // Handler for deleting a post (passed to PostCard)
  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)); // Optimistically update UI
      toast.success("Post deleted successfully!"); // User feedback
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      toast.error(error?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <div className=" space-y-5 ">
      {/* Post creation area */}
      <Card className="flex flex-row items-center justify-center gap-2 p-3 ">
        <Avatar radius="full" src={userData?.data?.profileImage} />
        <PostEditor
          openButtonText={`What's on your mind, ${
            userData?.data?.name || "Guest"
          }`}
          size="md"
          radius="full"
        />
      </Card>

      {/* Loading skeleton for posts while data is fetching */}
      {/* Show skeleton only if postData is null/undefined (initial load) */}
      {!postData && <PostSkeleton length={commentPost ? 1 : 4} />}

      {/* Render each post using the PostCard component */}
      {/* Ensure `posts` array is not null/undefined before mapping */}
      {posts?.map((post: IPost) => (
        <PostCard
          key={post._id}
          post={post}
          userData={userData?.data}
          handleUpdateFollowUnfollow={handleUpdateFollowUnfollow}
          handleDelete={handleDelete}
          triggerDebouncedEmit={triggerDebouncedEmit}
          showAllComments={showAllComments}
          modalCommentRef={modalCommentRef}
        />
      ))}

      {/* Optional: Message if no posts are found after loading */}
      {postData?.data && posts.length === 0 && !commentPost && (
        <p className="text-center text-gray-500">No posts found.</p>
      )}
    </div>
  );
};

export default Posts;
