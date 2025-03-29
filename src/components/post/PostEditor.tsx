"use client";
import React, { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Textarea, User } from "@heroui/react";
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
import LinkUpTextarea from "../form/LinkUpTextarea";

interface PostEditorProps {
  post?: IPost;
  openButtonIcon?: ReactNode;
  openButtonText?: ReactNode;
  size?: "sm" | "md" | "lg" | undefined;
  radius?: "sm" | "md" | "lg" | "full" | "none" | undefined;
  clickRef?: any;
}

const PostEditor: React.FC<PostEditorProps> = ({
  post,
  openButtonIcon,
  openButtonText,
  size,
  radius,
  clickRef,
}) => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const [createPost, { isLoading: createPostLoading }] =
    useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading }] =
    useUpdatePostMutation();

  const onSubmit = async (data: any, reset?: (values?: any) => void) => {
    console.log({ data });
    const extractedText = data?.content.replace(/<\/?p>/g, "");
    console.log({ extractedText });
    const formData = new FormData();

    // formData.append("image", data?.images);

    if (data?.images && Array.isArray(data.images)) {
      data.images.forEach((file: File) => {
        formData.append("images", file); // All files will be appended with the same key
      });
    }

    if (post) {
      formData.append(
        "data",
        JSON.stringify({
          ...data,
          _id: post?._id,
          // isPremium: updatePostData?.isPremium,
          author: userData?.data?._id,
          // content: data?.content.replace(/<\/?p>/g, ""),
          // images: updatePostData?.images,
          // content: updatePostData?.content,
        })
      );
    } else {
      formData.append(
        "data",
        JSON.stringify({
          ...data,
          author: userData?.data?._id,
          // content: data?.content.replace(/<\/?p>/g, ""),
        })
      );
    }

    const toastId = toast.loading("loading...");
    try {
      const res = post
        ? await updatePost(formData).unwrap()
        : await createPost(formData).unwrap();
      // const res =  await createPost(formData).unwrap()
      console.log({ res });
      console.log("res?.data?.content", res?.data?.content);
      if (res.success) {
        toast.success(res.message, { id: toastId });
        // reset?.();
        reset?.({
          isPremium: res?.data?.isPremium,
          content: res?.data?.content,
          images: res?.data?.images, // Ensure an array
        });
        // editor?.commands.clearContent();
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
      // modalSize="2xl"
      radius={radius}
      header={`${post ? "Update Post" : "Create post"}`}
      variant="ghost"
      openButtonIcon={openButtonIcon}
      className=" flex justify-start"
      clickRef={clickRef}
    >
      <User
        className=" flex justify-start"
        avatarProps={{
          src: `${userData?.data?.profileImage}`,
        }}
        description="Public"
        name={userData?.data?.name}
      />
      <LinkUpForm
        resolver={zodResolver(postEditorValidationSchema)}
        onSubmit={onSubmit}
        defaultValues={{
          isPremium: post?.isPremium,
          content: post?.content,
          images: post?.images, // Ensure an array
        }}
      >
        {userData?.data?.isVerified && (
          <LinkUpCheckbox name="isPremium" label="Premium Post" />
        )}
        <div className="py-3">
          <LinkUpTextarea
            name="content"
            placeholder={`What's on your mind, ${userData?.data?.name}`}
          />
        </div>

        <div className=" mb-2">
          <LinkUpInputFile name="images" label="Upload image" />
        </div>

        <div className="flex gap-4">
          <Button fullWidth size="sm" color="primary" type="submit">
            {createPostLoading
              ? "Posting..."
              : updatePostLoading
              ? "Updating..."
              : post
              ? "Update"
              : "Post"}
          </Button>
          {/* <Button type="reset" size="sm" variant="bordered">
            Reset
          </Button> */}
          {/* <LinkUpReset editor={editor} /> */}
        </div>
      </LinkUpForm>
    </LinkUpModal>
  );
};

export default PostEditor;
