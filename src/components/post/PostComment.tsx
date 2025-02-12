"use client";

import { useUser } from "@/context/UserProvider";
import {
  useGetUserByIdQuery,
  useGetUserQuery,
} from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment, IUserData } from "@/type";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetAllCommentQuery,
  useUpdateCommentMutation,
} from "@/redux/features/comment/commentApi";
import Posts from "./Posts";
import LinkUpForm from "../form/LinkUpForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema } from "@/schemas";
import { SendHorizontal, VerifiedIcon, X } from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";
import ActionButton from "../shared/ActionButton";
import { formatTime } from "@/uitls/formatTime";
import { Avatar } from "@heroui/react";

interface PostCommentProps {
  postId: string;
  openButtonText: ReactNode;
  comment?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
}

const PostComment: React.FC<PostCommentProps> = ({
  postId,
  openButtonText,
  comment,
  focusRef,
}) => {
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({}); // State to manage expanded comments
  const commentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  const [deleteComment] = useDeleteCommentMutation();
  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);

  // Handle creating a new comment
  const handleCreateComment = async (data: any, reset?: () => void) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }

    try {
      const newComment = {
        ...data,
        userId: userData?.data?._id,
        postId,
      };
      await createComment(newComment).unwrap();
      reset?.(); // Reset the form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create comment");
    }
  };

  // Handle updating an existing comment
  const handleUpdateComment = async (data: any, reset?: () => void) => {
    if (!editingComment || !userData?.data?._id) {
      return;
    }

    try {
      const updatedComment = {
        ...data,
        _id: editingComment._id,
        postId: postId,
        userId: userData?.data?._id,
      };
      await updateComment(updatedComment).unwrap();
      setEditingComment(null); // Reset editing state
      reset?.(); // Reset the form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const toastId = toast.loading("Loading...");
    try {
      const res = await deleteComment(commentId).unwrap();
      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  const handleEditComment = (comment: IComment) => {
    setEditingComment(comment); // Set the comment being edited
  };

  // Handle expanding/collapsing comments
  const toggleExpandComment = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle the expanded state for this comment
    }));
  };

  useEffect(() => {
    if (editingComment && commentRef.current[editingComment._id]) {
      commentRef.current[editingComment._id]?.focus();
    }
  }, [editingComment]);

  const commentData = comment
    ? allCommentData?.data?.slice(0, 2)
    : allCommentData?.data;

  return (
    <div>
      <LinkUpModal
        modalSize="3xl"
        className="flex justify-start hover:underline"
        openButtonText={openButtonText}
      >
        <div className="mb-4">
          <Posts postId={postId} comment={false} />
        </div>
      </LinkUpModal>
      <div className="flex-1 overflow-y-auto space-y-2 pt-1">
        {commentData?.map((comment: IComment) => {
          const maxWords = 20; // Maximum words to show initially
          const words = comment?.comment.split(" "); // Split comment into words
          const truncatedText = words.slice(0, maxWords).join(" "); // Truncated text (first 20 words)
          const shouldShowSeeMore = words.length > maxWords; // Check if "See More" is needed
          const isExpanded = expandedComments[comment._id] || false; // Get expanded state for this comment

          return (
            <div key={comment?._id} className="  ">
              {editingComment?._id !== comment?._id ? (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  {/* Comment Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* User Avatar */}
                    <Avatar
                      size="sm"
                      radius="full"
                      src={userData?.data?.profileImage}
                    />
                    {/* User Name and Verification Badge */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold whitespace-nowrap">
                        {comment?.userId?.name}
                      </span>
                      {comment?.userId?.isVerified && (
                        <VerifiedIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    {/* Edit/Delete Actions (for the comment owner) */}
                    {comment?.userId?._id === userData?.data?._id && (
                      <div className="ml-auto">
                        <ActionButton
                          onEdit={() => handleEditComment(comment)}
                          onDelete={() => handleDeleteComment(comment?._id)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Comment Body */}
                  <div>
                    {/* <p className="text-gray-800 text-start " >{comment?.comment}</p> */}
                    <p className="text-sm  text-start">
                      {isExpanded ? comment?.comment : truncatedText}
                      {shouldShowSeeMore && (
                        <button
                          onClick={() => toggleExpandComment(comment._id)}
                          className="text-blue-500 hover:text-blue-600 ml-1"
                        >
                          {isExpanded ? " See less" : " ...See more"}
                        </button>
                      )}
                    </p>
                  </div>

                  {/* Comment Footer */}
                  <div className="mt-2 flex items-center gap-4">
                    {/* <span className="text-gray-400 text-sm">2h ago</span> */}
                    <span className="text-gray-400 text-sm">
                      {formatTime(comment?.createdAt)}
                    </span>
                    <button className="text-gray-500 hover:text-gray-700">
                      Like
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      Reply
                    </button>
                  </div>

                  {/* Nested Comments */}
                  {/* {comment?.replies && (
                   <div className="pl-8 mt-4">
                     {comment.replies.map((reply) => (
                       <Comment key={reply._id} comment={reply} />
                     ))}
                   </div>
                 )} */}
                </div>
              ) : (
                <div className="mt-2">
                  <LinkUpForm
                    resolver={zodResolver(commentValidationSchema)}
                    onSubmit={(data, reset) => handleUpdateComment(data, reset)}
                    defaultValues={{ comment: editingComment?.comment }}
                  >
                    <LinkUpTextarea
                      name="comment"
                      size="sm"
                      focusRef={(el) => (commentRef.current[comment?._id] = el)}
                      placeholder="Edit your comment"
                      endContent={<SendHorizontal />}
                      onSubmit={handleUpdateComment}
                    />
                  </LinkUpForm>
                  <div
                    onClick={() => setEditingComment(null)}
                    className="flex justify-start text-xs text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Edit Cancel
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Form for adding new comments */}
        <LinkUpForm
          resolver={zodResolver(commentValidationSchema)}
          onSubmit={handleCreateComment}
        >
          <LinkUpTextarea
            name="comment"
            size="sm"
            focusRef={focusRef}
            placeholder="Add a comment"
            endContent={<SendHorizontal />}
            onSubmit={handleCreateComment}
          />
        </LinkUpForm>
      </div>
    </div>
  );
};

export default PostComment;
