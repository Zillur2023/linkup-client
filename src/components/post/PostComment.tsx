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
import { MessageCircle, SendHorizontal, VerifiedIcon, X } from "lucide-react";
import LinkUpTextarea from "../form/LinkUpTextarea";
import ActionButton from "../shared/ActionButton";
import { formatTime } from "@/uitls/formatTime";
import {
  Avatar,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  User,
} from "@heroui/react";

interface PostCommentProps {
  user: IUser;
  post: IPost;
  openButtonText: ReactNode;
  comment?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
  // modalRef?: boolean;
}

const PostComment: React.FC<PostCommentProps> = ({
  user,
  post,
  openButtonText,
  comment,
  focusRef,
  // modalRef,
}) => {
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({}); // State to manage expanded comments
  const editCommentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );
  const router = useRouter();

  const [deleteComment] = useDeleteCommentMutation();
  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(post?._id, {
    skip: !post?._id,
  });

  // Handle creating a new comment
  const handleCreateComment = async (data: any, reset?: () => void) => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

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

  console.log("focusRef? true : false", focusRef ? true : false);

  useEffect(() => {
    if (editingComment && editCommentRef.current[editingComment._id]) {
      editCommentRef.current[editingComment._id]?.focus();
    }
  }, [editingComment]);

  const commentData = comment
    ? allCommentData?.data?.slice(0, 2)
    : allCommentData?.data;

  const modalCommentRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );
  useEffect(() => {
    if (post?._id && openButtonText && modalCommentRef.current[post?._id]) {
      modalCommentRef.current[post?._id]?.focus();
    }
  }, [post?._id, openButtonText]);

  const commentTextarea = (
    <LinkUpForm
      resolver={zodResolver(commentValidationSchema)}
      onSubmit={handleCreateComment}
    >
      <LinkUpTextarea
        name="comment"
        size="sm"
        // focusRef={focusRef}
        focusRef={
          modalCommentRef
            ? (el) => (modalCommentRef.current[post?._id] = el)
            : focusRef
        }
        placeholder="Add a comment"
        endContent={<SendHorizontal />}
        onSubmit={handleCreateComment}
      />
    </LinkUpForm>
  );

  return (
    <div>
      <LinkUpModal
        modalSize="xl"
        className="flex justify-start hover:underline"
        openButtonText={openButtonText}
        fullWidth={false}
        title={`${user?.name}'s post`}
        footer={commentTextarea}
        scrollBehavior="inside"
      >
        <div className="  w-full">
          <Posts
            postId={post?._id}
            comment={false}
            modalCommentRef={
              <Button
                size="sm"
                variant="light"
                onClick={() => {
                  modalCommentRef?.current[post?._id]?.focus();
                  // setModalRef(true);
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
          const maxWords = 20; // Maximum words to show initially
          const words = comment?.comment.split(" "); // Split comment into words
          const truncatedText = words.slice(0, maxWords).join(" "); // Truncated text (first 20 words)
          const shouldShowSeeMore = words.length > maxWords; // Check if "See More" is needed
          const isExpanded = expandedComments[comment._id] || false; // Get expanded state for this comment

          return (
            <div key={comment?._id} className="   ">
              {editingComment?._id !== comment?._id ? (
                <>
                  <div className=" flex gap-1 ">
                    {/* User Avatar */}
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
                      <Card className="  p-3 break-words ">
                        <p className="text-gray-800 text-start ">
                          {user?.name}
                        </p>

                        {/* <p className="text-gray-800 text-start ">
                          {comment?.comment}
                        </p> */}
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
                      </Card>
                      <div>
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
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-2 ">
                  <LinkUpForm
                    resolver={zodResolver(commentValidationSchema)}
                    onSubmit={(data, reset) => handleUpdateComment(data, reset)}
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
              )}
            </div>
          );
        })}

        {/* Form for adding new comments */}
        {/* {comment && commentTextarea} */}
        {comment && (
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
        )}
        {/* {commentTextarea} */}
      </div>
    </div>
  );
};

export default PostComment;

// {<div>
//   <LinkUpModal
//   modalSize="xl"
//   className="flex justify-start hover:underline"
//   openButtonText={openButtonText}
//   fullWidth={false}
//   title={`${user?.name}'s post`}
//   // footer={commentTextarea}
//   scrollBehavior="inside"
//   >
//   <div className="  w-full">
//   <Posts postId={postId} comment={false} />
//   </div>
//   </LinkUpModal>

//   <div className="flex-1 overflow-y-auto space-y-2 ">
//   {commentData?.map((comment: IComment) => {
//   const maxWords = 20; // Maximum words to show initially
//   const words = comment?.comment.split(" "); // Split comment into words
//   const truncatedText = words.slice(0, maxWords).join(" "); // Truncated text (first 20 words)
//   const shouldShowSeeMore = words.length > maxWords; // Check if "See More" is needed
//   const isExpanded = expandedComments[comment._id] || false; // Get expanded state for this comment

//   return (
//     <div key={comment?._id} className="   ">
//       {editingComment?._id !== comment?._id ? (
//         <>
//           <div className=" flex gap-1 ">
//             {/* User Avatar */}
//             <div>
//               {user && (
//                 <Avatar
//                   size="sm"
//                   radius="full"
//                   src={user?.profileImage}
//                 />
//               )}
//             </div>
//             <div className=" w-full">
//               <Card className="  p-3 break-words ">
//                 <p className="text-gray-800 text-start ">
//                   {user?.name}
//                 </p>

//                 {/* <p className="text-gray-800 text-start ">
//                   {comment?.comment}
//                 </p> */}
//                 <p className="text-sm  text-start">
//                   {isExpanded ? comment?.comment : truncatedText}
//                   {shouldShowSeeMore && (
//                     <button
//                       onClick={() => toggleExpandComment(comment._id)}
//                       className="text-blue-500 hover:text-blue-600 ml-1"
//                     >
//                       {isExpanded ? " See less" : " ...See more"}
//                     </button>
//                   )}
//                 </p>
//               </Card>
//               <div>
//                 <div className="mt-2 flex items-center gap-4">
//                   {/* <span className="text-gray-400 text-sm">2h ago</span> */}
//                   <span className="text-gray-400 text-sm">
//                     {formatTime(comment?.createdAt)}
//                   </span>
//                   <button className="text-gray-500 hover:text-gray-700">
//                     Like
//                   </button>
//                   <button className="text-gray-500 hover:text-gray-700">
//                     Reply
//                   </button>
//                 </div>

//                 {/* Nested Comments */}
//                 {/* {comment?.replies && (
//         <div className="pl-8 mt-4">
//           {comment.replies.map((reply) => (
//             <Comment key={reply._id} comment={reply} />
//           ))}
//         </div>
//       )} */}
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="mt-2 ">
//           <LinkUpForm
//             resolver={zodResolver(commentValidationSchema)}
//             onSubmit={(data, reset) => handleUpdateComment(data, reset)}
//             defaultValues={{ comment: editingComment?.comment }}
//           >
//             <LinkUpTextarea
//               name="comment"
//               size="sm"
//               focusRef={(el) => (commentRef.current[comment?._id] = el)}
//               placeholder="Edit your comment"
//               endContent={<SendHorizontal />}
//               onSubmit={handleUpdateComment}
//             />
//           </LinkUpForm>
//           <div
//             onClick={() => setEditingComment(null)}
//             className="flex justify-start text-xs text-blue-500 hover:text-blue-600 hover:underline"
//           >
//             Edit Cancel
//           </div>
//         </div>
//       )}
//     </div>
//   );
//   })}

//   {/* Form for adding new comments */}
//   {/* {comment && commentTextarea} */}
//   {/* {commentTextarea} */}
//   </div>
//   </div>}
