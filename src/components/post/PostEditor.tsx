"use client";
import React, { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox } from "@heroui/react";
import { IPost, IUserData } from "@/type";
import { useUser } from "@/context/UserProvider";
import LinkUpModal from "../shared/LinkUpModal";
import { postEditorValidationSchema } from "@/schemas";
import LinkUpInputFile from "../form/LinkUpInputFile";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpEditor from "../form/LinkUpEditor";
import LinkUpCheckbox from "../form/LinkUpCheckbox";
import LinkUpReset from "../form/LinkUpReset";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import { useEditor } from "@tiptap/react";
import { toast } from "sonner";

interface PostEditorProps {
  updatePostData?: IPost;
  openButtonIcon?: ReactNode;
  openButtonText?: ReactNode;
  size?: "sm" | "md" | "lg" | undefined;
  radius?: "sm" | "md" | "lg" | "full" | "none" | undefined;
}

const PostEditor: React.FC<PostEditorProps> = ({
  updatePostData,
  openButtonIcon,
  openButtonText,
  size,
  radius,
}) => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const editor = useEditor({
    extensions: [
      // StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      // TextStyle.configure({ types: [ListItem.name] }),
      TextStyle.configure({}),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: updatePostData?.content,
  });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const onSubmit = async (data: any, reset?: () => void) => {
    // console.log("post data", data);
    const formData = new FormData();

    // formData.append("image", data?.images);

    if (data?.images && Array.isArray(data.images)) {
      data.images.forEach((file: File) => {
        formData.append("images", file); // All files will be appended with the same key
      });
    }

    if (updatePostData) {
      formData.append(
        "data",
        JSON.stringify({
          ...data,
          _id: updatePostData?._id,
          // isPremium: updatePostData?.isPremium,
          author: userData?.data?._id,
          // images: updatePostData?.images,
          // content: updatePostData?.content,
        })
      );
    } else {
      formData.append(
        "data",
        JSON.stringify({ ...data, author: userData?.data?._id })
      );
    }
    // console.log("formDatA post", [...formData.entries()]);

    const toastId = toast.loading("loading...");
    try {
      const res = updatePostData
        ? await updatePost(formData).unwrap()
        : await createPost(formData).unwrap();
      // const res =  await createPost(formData).unwrap()
      if (res.success) {
        toast.success(res.message, { id: toastId });
        reset?.();
        editor?.commands.clearContent();
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <LinkUpModal
      openButtonText={openButtonText}
      buttonSize={size}
      radius={radius}
      title={`${updatePostData ? "Update Post" : "Create a new post"}`}
      variant="ghost"
      openButtonIcon={openButtonIcon}
      className=" flex justify-start"
    >
      <LinkUpForm
        resolver={zodResolver(postEditorValidationSchema)}
        onSubmit={onSubmit}
        defaultValues={{
          isPremium: updatePostData?.isPremium,
          content: updatePostData?.content,
          images: updatePostData?.images, // Ensure an array
        }}
      >
        <LinkUpCheckbox name="isPremium" label="Premium Post" />
        <div className="py-3">
          <LinkUpEditor name="content" editor={editor} />
        </div>

        <div className="py-3">
          <LinkUpInputFile name="images" label="Upload image" />
        </div>

        <div className="flex gap-4">
          <Button className="w-full" size="sm" color="primary" type="submit">
            Submit
          </Button>
          {/* <Button type="reset" size="sm" variant="bordered">
            Reset
          </Button> */}
          <LinkUpReset editor={editor} />
        </div>
      </LinkUpForm>
    </LinkUpModal>
  );
};

export default PostEditor;
