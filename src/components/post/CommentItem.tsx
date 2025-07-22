// components/ui/comment/CommentItem.tsx
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Card } from "@heroui/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ActionButton from "@/components/shared/ActionButton";
import { formatCommentDate } from "@/uitls/formatDate";
import { IComment, IUser } from "@/type";
import CommentForm from "./CommentForm"; // Importing CommentForm for editing

interface CommentItemProps {
  comment: IComment;
  currentUser: IUser;
  onUpdate: (data: any) => Promise<void>; // Prop for handling update
  onDelete: (commentId: string) => Promise<void>; // Prop for handling delete
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onUpdate,
  onDelete,
}) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const maxWords = 20;
  const words = comment?.content?.split(" ") || [];
  const truncatedText = words.slice(0, maxWords).join(" ");
  const shouldShowSeeMore = words.length > maxWords;

  const handleEdit = () => {
    setEditingCommentId(comment._id);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleUpdateSubmit = async (data: IComment) => {
    await onUpdate({ ...data, _id: comment._id }); // Pass updated data and comment ID
    setEditingCommentId(null); // Exit edit mode
  };

  return (
    <div key={comment?._id} className="">
      {editingCommentId !== comment?._id ? (
        <>
          <div className="flex gap-1 relative group">
            <Link
              className="hover:underline"
              href={`/profile?id=${comment?.userId?._id}`}
            >
              <Avatar
                size="sm"
                radius="full"
                src={comment?.userId?.profileImage}
              />
            </Link>
            <div>
              <Card
                shadow="none"
                radius="lg"
                className="bg-default-100 p-3 break-words"
              >
                <div className="flex justify-start gap-1">
                  <Link
                    className="hover:underline"
                    href={`/profile?id=${comment?.userId?._id}`}
                  >
                    <p className="text-gray-800 text-start text-medium font-semibold">
                      {comment?.userId?.name}
                    </p>
                  </Link>
                  {comment?.userId?.isVerified && (
                    <RiVerifiedBadgeFill className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                <p className="text-medium text-start">
                  {expanded ? comment?.content : truncatedText}
                  {shouldShowSeeMore && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-sm text-blue-500 hover:text-blue-600 ml-1"
                    >
                      {expanded ? " See less" : " ...See more"}
                    </button>
                  )}
                </p>
              </Card>
              <div className="flex items-center gap-4 mt-1 pl-2">
                <span className="text-gray-400 text-xs ">
                  {formatCommentDate(comment?.createdAt)}
                </span>
                <button
                  disabled
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  Like
                </button>
                <button
                  disabled
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  Reply
                </button>
              </div>
            </div>
            {currentUser?._id === comment?.userId?._id && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ActionButton
                  onEdit={handleEdit}
                  onDelete={() => onDelete(comment._id)}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-2 flex gap-1 w-full">
          <div>
            {currentUser && (
              <Avatar size="sm" radius="full" src={currentUser?.profileImage} />
            )}
          </div>
          <CommentForm
            onSubmit={handleUpdateSubmit}
            defaultContent={comment.content}
            focusTargetId={comment._id}
            onCancelEdit={handleCancelEdit}
            isEditing={true}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
