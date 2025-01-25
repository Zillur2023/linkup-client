
"use client";
import React, { ReactNode, useEffect } from "react";
import {
  FieldValues,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";

import { useGetUserQuery } from "@/redux/features/user/userApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox } from "@heroui/react";
import { IPost, IUserData } from "@/type";
import { useUser } from "@/context/UserProvider";
import LinkUpModal from "./LinkUpModal";
import { postEditorValidationSchema } from "@/schemas";
import LinkUpInputFile from "../form/LinkUpInputFile";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpEditor from "../form/LinkUpEditor";
import LinkUpCheckbox from "../form/LinkUpCheckbox";
import LinkUpReset from "../form/LinkUpReset";

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import { useEditor } from "@tiptap/react";

interface PostEditorProps {
  updatePostData?: IPost; 
  button?: ReactNode;
}

const PostEditor: React.FC<PostEditorProps> = ({ updatePostData, button }) => {
  const { user } = useUser();
  const { data: userData } = useGetUserQuery<IUserData>(user?.email, { skip: !user?.email});

  const editor = useEditor({
    extensions: [
        // StarterKit,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Highlight,
          Color.configure({ types: [TextStyle.name, ListItem.name] }),
          TextStyle.configure({ types: [ListItem.name] }),
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
   
  })


  const [createPost] = useCreatePostMutation();
//   const [updatePost] = useUpdatePostMutation();

// const { reset } = useFormContext(); // Access the reset method


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("POstEditor data", data)
  
    const formData = new FormData();

    // const updatedData: any = {
    //   ...data,
    //   _id: updatePostData?._id,
    //   author: userData?.data?._id,
    //   content: plainText,
    // };


    // formData.append("image", imageFiles?.[0]);

    // formData.append("data", JSON.stringify(updatedData));

    // const toastId = toast.loading("loading...");
    // try {
    //   const res = updatePostData
    //     ? await updatePost(formData).unwrap()
    //     : await createPost(formData).unwrap();

    //   if (res.success) {
    //     toast.success(res.message, { id: toastId });
    //     reset();
    //   }
    // } catch (error: any) {
    //   toast.error(error?.data?.message, { id: toastId });
    // }
    // createPost(data)
  };

  

  return (
    <LinkUpModal
      // buttonText="Edit Profile"
      openButtonText={`${updatePostData ? "Update Post" : "Create a new post"}`}
      actionButtonText={`${updatePostData ? "Update" : "Create"}`}
      title={`${updatePostData ? "Update Post" : "Create a new post"}`}
      variant="bordered"
      ClassName="rounded-md border hover:border-blue-500 py-0 w-full"
      openButton={button}
    >
          <LinkUpForm
              
                resolver={zodResolver(postEditorValidationSchema)}
                onSubmit={onSubmit}
                defaultValues={{
                  isPremium: false, // Default value for the checkbox
                  content: "", // Default value for the editor
                  image: null, // Default value for the file input
                }}
                
              >
   
          {!userData?.data?.isVerified && (
         
            <LinkUpCheckbox name="isPremium" label="Premium Post" />
          )}
          <div className="py-3">

   
        <LinkUpEditor name="content" editor={editor} />
          </div>

          <div className="py-3">
         


          <LinkUpInputFile name="image" label="Image UploaD" />

            {/* <p   dangerouslySetInnerHTML={{
        __html: getValues('content') ,
      }}></p> */}
          </div>

          <div className="flex gap-4">
          <Button className="w-full" size="sm" color="primary" type="submit">
            Submit
          </Button>
          {/* <Button type="reset" size="sm" variant="bordered">
            Reset
          </Button> */}
          <LinkUpReset editor={editor}/>
           {/* <Button type="button" size="sm" variant="bordered" onClick={()=> reset({isPremium:false, content:"", image: null})}>
                Reset
              </Button> */}
        </div>
       
    

      </LinkUpForm>
    </LinkUpModal>
  );
};

export default PostEditor;
