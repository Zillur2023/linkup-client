"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment } from "@/type";
import { Avatar, Tooltip } from "@heroui/react";
import ActionButton from "../shared/ActionButton";
import { useCreateCommentMutation, useDeleteCommentMutation, useGetAllCommentQuery } from "@/redux/features/comment/commentApi";
import Posts from "./Posts";
import LinkUpForm from "../form/LinkUpForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema } from "@/schemas";
import { SendHorizontal } from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";


interface PostCommentProps {
  postId: string;
  openButtonText: ReactNode;
  comment?: boolean;
  focusRef?:(el: HTMLInputElement | null) => void;
}

const PostComment: React.FC<PostCommentProps> = ({ postId, openButtonText, comment, focusRef }) => {
  // const { user } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter()
  const { user } = useUser();
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [deleteComment] = useDeleteCommentMutation();
  const [createComment] = useCreateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);
  

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const updatedData = {
      ...data,
      userId: userData?.data?._id,
      postId,
      // postId:selectedPostId,
    };
    try {
      await createComment(updatedData).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const toastId = toast.loading("loading...");
    try {
      const res = await deleteComment(commentId).unwrap();

      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  const commentData = comment
    ? allCommentData?.data?.slice(0, 2)
    : allCommentData?.data;



  return (
    <div>
      <LinkUpModal
        ClassName=" flex justify-start"
        openButtonText={openButtonText}
        footerButton={false}
        // onClose={() => setShowModal(false)} // Close modal
      >
        <div className="mb-4">
          <Posts postId={postId} comment={false} />
        </div>
      </LinkUpModal>
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          {commentData?.map((comment: IComment) => (
            <div key={comment?._id} className="flex items-start space-x-2">
              <Tooltip content={comment?.userId?.email}>
                <Avatar src={comment?.userId?.image?.[0]} alt="Commenter" />
              </Tooltip>
              <div className=" bg-transparent text-gray-500 p-2 rounded-lg">
                <div className="flex gap-3 ">
                  <p>
                    <strong>{comment?.userId?.name}</strong>
                  </p>
                  {/* <Trash2
                    onClick={() => handleDeleteComment(comment?._id)}
                    className="text-red-500 cursor-pointer size-4"
                  /> */}
                  { comment?.userId?._id == userData?.data?._id && ( <ActionButton onDelete={() => handleDeleteComment(comment?._id)}/> )}
             
                </div>
                {/* {comment?.author?._id == userData?.data?._id &&  <Trash2 onClick={() => handleDeleteComment(comment?._id)} className="text-red-500 cursor-pointer" />} */}

                <p>{comment?.comment}</p>
              </div>
            </div>
          ))}
        </div>
          <LinkUpForm
               resolver={zodResolver(commentValidationSchema)}
               onSubmit={onSubmit}
                     >
               <LinkUpTextarea name="comment" size="sm" focusRef={focusRef} 
               placeholder="Comment"
               endContent={<SendHorizontal />} />
         
        </LinkUpForm>
      </div>
    </div>
  );
};

export default PostComment;
