"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment, IPost, IUser } from "@/type";
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
import {
  Ellipsis,
  MessageCircle,
  SendHorizontal,
  VerifiedIcon,
  X,
} from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";
import ActionButton from "../shared/ActionButton";
import { formatTime } from "@/uitls/formatTime";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

interface PostCommentProps {
  user: IUser;
  post: IPost;
  startContent?: ReactNode;
  openButtonText: ReactNode;
  showAllComments?: boolean;
  hideComments?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
  clickRef?: any;
}

const PostComment: React.FC<PostCommentProps> = ({
  user,
  post,
  startContent,
  openButtonText,
  showAllComments,
  hideComments,
  focusRef,
  clickRef,
}) => {
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const editCommentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );

  const router = useRouter();

  const [deleteComment, { isLoading: deleteCommentLoading }] =
    useDeleteCommentMutation();
  const [createComment, { isLoading: createCommentLoading }] =
    useCreateCommentMutation();
  const [updateComment, { isLoading: updateCommentLoading }] =
    useUpdateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(post?._id, {
    skip: !post?._id,
  });

  const commentData = hideComments
    ? []
    : showAllComments
    ? allCommentData?.data
    : allCommentData?.data?.slice(0, 2);

  const modalCommentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );

  // Handle creating a new comment
  const handleCreateComment = async (data: any, reset?: () => void) => {
    try {
      const newComment = {
        ...data,
        userId: user?._id,
        postId: post?._id,
      };
      await createComment(newComment).unwrap();
      reset?.(); // Reset the form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create comment");
    }
  };

  // Handle updating an existing comment
  const handleUpdateComment = async (data: any, reset?: () => void) => {
    if (!editingComment || !user?._id) {
      return;
    }

    try {
      const updatedComment = {
        ...data,
        _id: editingComment._id,
        postId: post?._id,
        userId: user?._id,
      };
      await updateComment(updatedComment).unwrap();
      setEditingComment(null); // Reset editing state
      reset?.(); // Reset the form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const toastId = toast.loading("");
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
    if (editingComment && editCommentRef.current[editingComment._id]) {
      editCommentRef.current[editingComment._id]?.focus();
    }
  }, [editingComment]);

  const commentTextarea = (
    <LinkUpForm
      resolver={zodResolver(commentValidationSchema)}
      onSubmit={handleCreateComment}
    >
      <LinkUpTextarea
        name="comment"
        size="sm"
        focusRef={focusRef}
        // focusRef={
        //   modalCommentRef
        //     ? (el) => (modalCommentRef.current[post?._id] = el)
        //     : focusRef
        // }
        placeholder="Add a comment"
        endContent={<SendHorizontal />}
        onSubmit={handleCreateComment}
      />
    </LinkUpForm>
  );

  return (
    <div>
      <LinkUpModal
        clickRef={clickRef}
        modalSize="2xl"
        startContent={startContent}
        openButtonText={openButtonText}
        fullWidth={false}
        header={`${user?.name}'s post`}
        footer={commentTextarea}
        scrollBehavior="inside"
        className={`${!hideComments ? "mb-2" : ""}`}
      >
        <div className="  w-full">
          <Posts
            postId={post?._id}
            showAllComments={true}
            modalCommentRef={
              <Button
                fullWidth
                size="sm"
                variant="light"
                onClick={() => {
                  modalCommentRef?.current[post?._id]?.focus();
                }}
                startContent={<MessageCircle />}
              >
                <span>{post?.comments?.length}</span>
              </Button>
            }
          />
        </div>
      </LinkUpModal>

      <div className="flex-1 overflow-y-auto space-y-2 ">
        {commentData?.map((comment: IComment) => {
          const maxWords = 20;
          const words = comment?.comment.split(" ");
          const truncatedText = words.slice(0, maxWords).join(" ");
          const shouldShowSeeMore = words.length > maxWords;
          const isExpanded = expandedComments[comment._id] || false;

          return (
            <div key={comment?._id} className="   ">
              {editingComment?._id !== comment?._id ? (
                <>
                  <div className=" flex gap-1 relative group ">
                    <div>
                      {user && (
                        <Avatar
                          size="sm"
                          radius="full"
                          src={user?.profileImage}
                        />
                      )}
                    </div>
                    <div className=" ">
                      <Card className="  p-3 break-words ">
                        <p className="text-gray-800 text-start text-medium font-semibold  ">
                          {user?.name}
                        </p>

                        <p className=" text-medium  text-start">
                          {/* {isExpanded ? comment?.comment : truncatedText}
                          {shouldShowSeeMore && (
                            <button
                              onClick={() => toggleExpandComment(comment._id)}
                              className="text-blue-500 hover:text-blue-600 ml-1"
                            >
                              {isExpanded ? " See less" : " ...See more"}
                            </button>
                          )} */}
                          {updateCommentLoading
                            ? editingComment?.comment
                            : comment?.comment}
                        </p>
                      </Card>
                      <div>
                        {!updateCommentLoading ? (
                          <div className=" flex items-center gap-4">
                            <span className="text-gray-400 text-xs ">
                              {formatTime(comment?.createdAt)}
                            </span>
                            <button className="text-gray-500 hover:text-gray-700 text-xs">
                              Like
                            </button>

                            <button className="text-gray-500 hover:text-gray-700 text-xs">
                              Reply
                            </button>
                          </div>
                        ) : (
                          "Updating..."
                        )}
                      </div>
                    </div>
                    {user?._id === comment?.userId?._id && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ActionButton
                          onEdit={() => handleEditComment(comment)}
                          onDelete={() => handleDeleteComment(comment._id)}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-2 flex gap-1 ">
                  <div>
                    {user && (
                      <Avatar
                        size="sm"
                        radius="full"
                        src={user?.profileImage}
                      />
                    )}
                  </div>
                  <div className=" w-full">
                    <LinkUpForm
                      resolver={zodResolver(commentValidationSchema)}
                      onSubmit={(data, reset) =>
                        handleUpdateComment(data, reset)
                      }
                      defaultValues={{ comment: editingComment?.comment }}
                    >
                      <LinkUpTextarea
                        name="comment"
                        size="sm"
                        focusRef={(el) =>
                          (editCommentRef.current[comment?._id] = el)
                        }
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
                </div>
              )}
            </div>
          );
        })}

        {/* Form for adding new comments */}
        {!hideComments && !post && showAllComments && commentTextarea}
      </div>
    </div>
  );
};

export default PostComment;
