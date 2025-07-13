"use client";
import React, { ReactNode, useRef } from "react";

import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { IPost } from "@/type";
import { useUser } from "@/context/UserProvider";
import LinkUpModal from "../shared/LinkUpModal";
import { postEditorValidationSchema } from "@/schemas";
import LinkUpInputFile from "../form/LinkUpInputFile";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpCheckbox from "../form/LinkUpCheckbox";

import { toast } from "sonner";
import LinkUpTextarea from "../form/LinkUpTextarea";
import Author from "../shared/Author";

interface PostEditorProps {
  post?: IPost;
  openButtonIcon?: ReactNode;
  openButtonText?: ReactNode;
  size?: "sm" | "md" | "lg" | undefined;
  radius?: "sm" | "md" | "lg" | "full" | "none" | undefined;
  clickRef?: any;
}

const PostEditor = ({
  post,
  openButtonIcon,
  openButtonText,
  size,
  radius,
  clickRef,
}: PostEditorProps) => {
  const clickSubmitRef = useRef<HTMLButtonElement | null>(null);
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const [createPost, { isLoading: createPostLoading }] =
    useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading }] =
    useUpdatePostMutation();

  const onSubmit = async (data: any, reset?: (values?: any) => void) => {
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
          // content: data?.content,
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
          // content: data?.content,
        })
      );
    }

    try {
      const res = post
        ? await updatePost(formData).unwrap()
        : await createPost(formData).unwrap();
      // const res =  await createPost(formData).unwrap()
      if (res.success) {
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
      toast.error(error?.data?.message);
    }
  };

  return (
    <LinkUpModal
      openButtonText={openButtonText}
      buttonSize={size}
      // modalSize="2xl"
      scrollBehavior="inside"
      radius={radius}
      header={`${post ? "Update Post" : "Create post"}`}
      footer={
        <div className=" w-full ">
          <Button
            fullWidth
            size="sm"
            color="primary"
            onClick={() => clickSubmitRef?.current?.click()}
          >
            {createPostLoading
              ? "Posting..."
              : updatePostLoading
              ? "Updating..."
              : post
              ? "Update"
              : "Post"}
          </Button>
        </div>
      }
      variant="ghost"
      openButtonIcon={openButtonIcon}
      className=" flex justify-start"
      clickRef={clickRef}
    >
      <div className=" text-start">
        {userData?.data && (
          <Author author={userData.data} description="Public" />
        )}
      </div>
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
        <div className="">
          <LinkUpTextarea
            name="content"
            placeholder={`What's on your mind, ${userData?.data?.name}`}
            minRows={4}
            maxRows={12}
            className=" "
          />
        </div>

        <div className=" ">
          <LinkUpInputFile name="images" label="Upload image" />
        </div>

        <div className=" hidden">
          <Button
            ref={clickSubmitRef}
            fullWidth
            size="sm"
            color="primary"
            type="submit"
          >
            {createPostLoading
              ? "Posting..."
              : updatePostLoading
              ? "Updating..."
              : post
              ? "Update"
              : "Post"}
          </Button>
        </div>
      </LinkUpForm>
    </LinkUpModal>
  );
};

export default PostEditor;
