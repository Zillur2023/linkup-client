// components/Comment.tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment, IPost, IUser } from "@/type";
import Posts from "./Posts";
import { Button, Avatar, Card } from "@heroui/react";
import { FiMessageCircle } from "react-icons/fi";

import { useSocketContext } from "@/context/socketContext";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentProps {
  user: IUser;
  post: IPost;
  startContent?: ReactNode;
  openButtonText: ReactNode;
  showAllComments?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
  clickRef?: any;
}

const Comment = ({
  user,
  post,
  startContent,
  openButtonText,
  showAllComments,
  focusRef,
  clickRef,
}: CommentProps) => {
  const { socket } = useSocketContext();
  const [commentText, setCommentText] = useState<string | null>(null);

  const modalCommentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );

  const commentsToDisplay = showAllComments
    ? post?.comments || []
    : (post?.comments || []).slice(0, 2);

  const handleCreateComment = async (data: IComment, reset?: () => void) => {
    setCommentText(data?.content);
    try {
      const newComment = {
        ...data,
        userId: user?._id,
        postId: post?._id,
      };
      socket?.emit("addComment", newComment);
      reset?.();
      setCommentText(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create comment");
      setCommentText(null);
    }
  };

  const handleUpdateComment = async (data: any) => {
    if (!user?._id || !data._id) {
      return;
    }
    try {
      const updatedComment = {
        ...data,
        postId: post?._id,
        userId: user?._id,
      };
      socket?.emit("updateComment", updatedComment);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      socket?.emit("deleteComment", commentId);
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <LinkUpModal
        clickRef={clickRef}
        modalSize="2xl"
        startContent={startContent}
        openButtonText={openButtonText}
        fullWidth={false}
        header={`${post?.author?.name}'s post`}
        footer={
          <CommentForm
            onSubmit={handleCreateComment}
            focusTargetId={post?._id}
          />
        }
        scrollBehavior="inside"
        className="mb-2"
      >
        <div className="w-full">
          <Posts
            commentPost={post}
            showAllComments={true}
            modalCommentRef={
              <Button
                fullWidth
                size="sm"
                variant="light"
                onClick={() => {
                  modalCommentRef?.current[post?._id]?.focus();
                }}
                startContent={<FiMessageCircle size={24} />}
              >
                <span>{post?.comments?.length}</span>
              </Button>
            }
          />
        </div>
      </LinkUpModal>

      <div className="flex-1 overflow-y-auto space-y-2 ">
        {commentText && (
          <div className="flex items-start gap-2">
            <Avatar
              src={user.profileImage || "/default-avatar.png"}
              className="w-8 h-8"
            />
            <div>
              <Card
                shadow="none"
                radius="lg"
                className="bg-default-100 p-3 break-words"
              >
                <p className="text-sm">{"zillur"}</p>
              </Card>
              <p className="text-xs text-gray-500">Sending...</p>
            </div>
          </div>
        )}

        {commentsToDisplay?.map((comment: IComment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={user}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        ))}

        {!post && showAllComments && (
          <CommentForm
            onSubmit={handleCreateComment}
            focusTargetId="main-comment-form"
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
