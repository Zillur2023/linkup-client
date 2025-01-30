"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import LinkUpModal from "../shared/LinkUpModal";
import { IComment } from "@/type";
import { Avatar, Tooltip, User } from "@heroui/react";
import ActionButton from "../shared/ActionButton";
import { useCreateCommentMutation, useDeleteCommentMutation, useGetAllCommentQuery } from "@/redux/features/comment/commentApi";
import Posts from "./Posts";
import LinkUpForm from "../form/LinkUpForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema } from "@/schemas";
import { SendHorizontal, VerifiedIcon } from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";


interface PostCommentProps {
  postId: string;
  openButtonText: ReactNode;
  comment?: boolean;
  focusRef?:(el: HTMLTextAreaElement | null) => void;
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
  

//   const onSubmit: SubmitHandler<FieldValues> = async (data, reset) => {
    const onSubmit = async (data: any, reset?: () => void) => {

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
      reset?.();
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
      <div className="flex-1 overflow-y-auto space-y-2 pt-1">
          {commentData?.map((comment: IComment) => (
            <User key={comment?._id} className=" flex items-center justify-start bg-gray-100"
            //  name= {comment?.userId?.name}
            name={
              <span className="flex items-center  gap-2">
                <span className={`whitespace-nowrap `}>
                  {comment?.userId?.name}
                </span>
                {comment?.userId?.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500" />}
              </span>
            }
            description={
              <p className="">{comment?.comment} {console.log("comment?.comment", comment?.comment)} </p>
            }
            avatarProps={{
              src: `${comment?.userId?.image?.[0]}`,
            }}
          />
          ))}
          <LinkUpForm
               resolver={zodResolver(commentValidationSchema)}
               onSubmit={onSubmit}
                     >
               <LinkUpTextarea onSubmit={(data) => onSubmit(data)}  name="comment" size="sm" focusRef={focusRef} 
               placeholder="Comment"
               endContent={<SendHorizontal />} />
         
        </LinkUpForm>
      </div>
    </div>
  );
};

export default PostComment;
