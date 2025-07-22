// components/ui/comment/CommentForm.tsx
import React, { useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import LinkUpForm from "@/components/form/LinkUpForm";
import LinkUpTextarea from "@/components/form/LinkUpTextarea";
import { commentValidationSchema } from "@/schemas";
import { IComment } from "@/type";

interface CommentFormProps {
  onSubmit: (data: IComment, reset?: () => void) => Promise<void>;
  defaultContent?: string;
  focusTargetId?: string;
  onCancelEdit?: () => void; // Optional prop for edit mode
  isEditing?: boolean; // Optional prop to indicate edit mode
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  defaultContent,
  focusTargetId,
  onCancelEdit,
  isEditing = false,
}) => {
  const textareaRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    if (focusTargetId && textareaRef.current[focusTargetId]) {
      textareaRef.current[focusTargetId]?.focus();
    }
  }, [focusTargetId, defaultContent]); // Re-focus if defaultContent changes (e.g., when editing different comments)

  return (
    <div className="w-full">
      <LinkUpForm
        resolver={zodResolver(commentValidationSchema)}
        onSubmit={onSubmit}
        defaultValues={{ content: defaultContent || "" }}
      >
        <LinkUpTextarea
          name="content"
          size="sm"
          minRows={1}
          focusRef={(el) =>
            (textareaRef.current[focusTargetId || "default"] = el)
          }
          placeholder={isEditing ? "Update comment" : "Add a comment"}
          endContent={<IoSend size={24} />}
          onSubmit={onSubmit} // Passing onSubmit to LinkUpTextarea for internal form submission
        />
      </LinkUpForm>
      {isEditing && (
        <button
          onClick={onCancelEdit}
          className="text-xs text-blue-500 hover:text-blue-600 hover:underline mt-1"
        >
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default CommentForm;
