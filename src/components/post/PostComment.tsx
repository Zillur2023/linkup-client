"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment } from "@/type";
import { Avatar, User } from "@heroui/react";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
//   useUpdateCommentMutation,
  useGetAllCommentQuery,
  useUpdateCommentMutation,
} from "@/redux/features/comment/commentApi";
import Posts from "./Posts";
import LinkUpForm from "../form/LinkUpForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema } from "@/schemas";
import { SendHorizontal, VerifiedIcon } from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";
import ActionButton from "../shared/ActionButton";

interface PostCommentProps {
  postId: string;
  openButtonText: ReactNode;
  comment?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
}

const PostComment: React.FC<PostCommentProps> = ({ postId, openButtonText, comment, focusRef }) => {
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [deleteComment] = useDeleteCommentMutation();
  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>("");

  const onSubmit = async (data: any, reset?: () => void) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }

    try {
      if (editingCommentId) {
        // Update the comment
        const editCommentData = {
                            ...data,
                             _id: editingCommentId,
                              postId: postId,
                               userId: userData?.data?._id,
                                comment: data.comment 
                            }
        console.log({editCommentData})
        await updateComment(editCommentData).unwrap();
        setEditingCommentId(null); // Reset editing state
        setEditedCommentText(""); // Clear the edited text
      } else {
        // Create a new comment
        const updatedData = {
          ...data,
          userId: userData?.data?._id,
          postId,
        };
        await createComment(updatedData).unwrap();
      }
      reset?.(); // Reset the form
    } catch (error: any) {
      toast.error(error?.data?.message);
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

  const handleEditComment = (comment:IComment) => {
    setEditingCommentId(comment?._id); // Set the comment being edited
    setEditedCommentText(comment?.comment); // Set the existing comment text
  };

  const commentData = comment
    ? allCommentData?.data?.slice(0, 2)
    : allCommentData?.data;

  return (
    <div>
      <LinkUpModal
        ClassName="flex justify-start"
        openButtonText={openButtonText}
        footerButton={false}
      >
        <div className="mb-4">
          <Posts postId={postId} comment={false} />
        </div>
      </LinkUpModal>
      <div className="flex-1 overflow-y-auto space-y-2 pt-1">
        {commentData?.map((comment: IComment) => (
          <div key={comment?._id}>
         {editingCommentId !== comment?._id ? (
              <User
                className="flex items-center justify-start bg-gray-100"
                name={
                  <div className="flex items-center gap-2">
                    <span className={`whitespace-nowrap`}>{comment?.userId?.name}</span>
                    {comment?.userId?.isVerified && (
                      <VerifiedIcon className="w-5 h-5 text-blue-500" />
                    )}
                    {comment?.userId?._id === userData?.data?._id && (
                      <ActionButton
                        onEdit={() => handleEditComment(comment)}
                        onDelete={() => handleDeleteComment(comment?._id)}
                      />
                    )}
                  </div>
                }
                description={<p className="">{comment?.comment}</p>}
                avatarProps={{
                  src: `${comment?.userId?.image?.[0]}`,
                }}
              />
            ) : (
              <div className="mt-2">
                <LinkUpForm
                  resolver={zodResolver(commentValidationSchema)}
                  onSubmit={(data, reset) => onSubmit(data, reset)}
                  defaultValues={{ comment: editedCommentText }}
                >
                  <LinkUpTextarea
                    name="comment"
                    size="sm"
                    focusRef={focusRef}
                    placeholder="Edit your comment"
                    endContent={<SendHorizontal />}
                    onSubmit={onSubmit}
                  />
                </LinkUpForm>
              </div>
            )}
          </div>
        ))}

        {/* Form for adding new comments */}
        <LinkUpForm
          resolver={zodResolver(commentValidationSchema)}
          onSubmit={onSubmit}
        >
          <LinkUpTextarea
            name="comment"
            size="sm"
            focusRef={focusRef}
            placeholder="Add a comment"
            endContent={<SendHorizontal />}
            onSubmit={onSubmit}
          />
        </LinkUpForm>
      </div>
    </div>
  );
};

export default PostComment;