"use client";
import { useRef, useState } from "react";
// import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Trash2,
  Pencil,
  Download,
} from "lucide-react";
import { useUser } from "@/context/UserProvider";
import { useGetUserQuery, useUpdateFollowUnfollowMutation } from "@/redux/features/user/userApi";
import { IPostData, IUserData } from "@/type";
import useDebounce from "@/hooks/debounce.hooks";
import { useDeletePostMutation, useGetAllPostQuery, useUpdateDislikesMutation, useUpdateLikesMutation } from "@/redux/features/post/postApi";
import { toast } from "sonner";
import { PostSkeleton } from "../shared/Skeleton";
import { categoryOptions, sortOptions } from "@/constant";
import Author from "../shared/Author";
import LinkUpButton from "../shared/LinkUpButton";
import LinkUpModal from "../shared/LinkUpModal";
import { generatePDF } from "@/uitls/generatePDF";
import { useRouter } from "next/navigation";
import { PostImageGallery } from "./PostImageGallery";
import ActionButton from "../shared/ActionButton";
import PostEditor from "./PostEditor";

interface PostsProps {
  postId?: string;
  comment?: boolean;
}

const Posts: React.FC<PostsProps> = ({ postId , comment = true }) => {
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserQuery<IUserData>(user?.email, {
    skip: !user?.email,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const debounceSearch = useDebounce(searchTerm)

  const queryPost = postId
    ? { postId }
    : {
        // searchTerm,
        searchTerm : debounceSearch,
        sortBy,
        isPremium: userData?.data?.isVerified ? true : undefined,
      };
  const { data: postData } = useGetAllPostQuery<IPostData>(queryPost);

  console.log({postData})


  const [updateLike] = useUpdateLikesMutation();
  const [updateDislike] = useUpdateDislikesMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const postRef = useRef<HTMLDivElement>(null); // Ref for the div to be converted to PDF


  const handleCommentClick = (postId: string) => {
    inputRefs?.current[postId]?.focus();
  };

  const handleLike = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const upvotePostData = { userId: userData?.data?._id, postId };
    try {
      await updateLike(upvotePostData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleDislike = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const downvotePostData = { userId: userData?.data?._id, postId };
    try {
      await updateDislike(downvotePostData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleUpdateFollowUnfollow = async (id: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    try {
      const res = await updateFollowUnfollow({
        targetId: id,
        loginUserId: userData?.data?._id,
      }).unwrap();
    } finally {
    }
  };

  const handleDelete = async (postId: string) => {
    const toastId = toast.loading("loading...");
    try {
      const res = await deletePost(postId).unwrap();
      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <>
      { !postData && <PostSkeleton />  }
        <div className="space-y-4 max-w-[640px]   mx-auto">
       

          {postData?.data?.map((post) => (
            <Card
              ref={postRef}
              key={post._id}
              isFooterBlurred
              className=" w-full p-0 md:p-5 "
            >
              {/* Author Info */}
              <CardHeader className=" justify-between ">
                <Author
                  author={post?.author}
                  className="text-lg font-semibold"
                />
                <div className="flex items-center gap-3">
                  {post?.author?._id !== userData?.data?._id && (
                    <LinkUpButton
                      onClick={() =>
                        handleUpdateFollowUnfollow(post?.author?._id)
                      }
                      buttonId="followOrUnfollow"
                      ClassName=" "
                    >
                      {userData?.data?.following?.includes(post?.author?._id)
                        ? "Unfollow"
                        : "Follow"}
                    </LinkUpButton>
                  )}
                   {post?.author?._id === userData?.data?._id && (
                    <PostEditor
                      updatePostData={post}
                      button={
                        <Pencil className="bg-gray-300 p-1 rounded-md w-full h-full" />
                      }
                    />
                    // <ActionButton/>
                  )}
                
                  {post?.author?._id === userData?.data?._id && (
                    <LinkUpModal
                      title=""
                      openButton={
                        <Trash2 className="text-red-500 cursor-pointer bg-gray-300 p-1 rounded-md w-full h-full" />
                      }
                    //   actionButtonText="Delete"
                    //   onUpdate={() => handleDelete(post?._id)}
                    >
                      <p className=" text-red-500 font-semibold text-medium">
                        {" "}
                        Are your sure to delete{" "}
                      </p>
                    </LinkUpModal>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {post?.isPremium && (
                  <div className=" flex justify-end  ">
                    {" "}
                    <span className=" border-1  font-normal text-green-500 py-0 px-2 rounded-md">
                      Premium
                    </span>{" "}
                  </div>
                )}
            
                {/* Post Image */}
                {post?.image && (
          
              <PostImageGallery images={post?.image} />
                )}

                {/* Post Content */}
                <p className="my-5">{post.content}</p>
              </CardBody>

              <CardFooter className="justify-between ">
                {/* Post Interactions */}
                {/* <Tooltip content={post?.likes?.[index+1]?.name}> */}
                

                <LinkUpButton
                  onClick={() => handleLike(post._id)}
                  buttonId="like"
                  data={post?.likes}
                >
                  <ThumbsUp
                    size={18}
                    className={`${
                      post?.likes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />

                  <span>{post.likes.length}</span>
                </LinkUpButton>

                <LinkUpButton
                  onClick={() => handleDislike(post._id)}
                  buttonId="dislike"
                  data={post?.dislikes}
                >
                  <ThumbsDown
                    size={18}
                    className={`${
                      post?.dislikes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                  <span>{post.dislikes.length}</span>
                </LinkUpButton>

                <div className="">
                 
                
                  <Button
                    size="sm"
                    className="flex items-center  bg-transparent hover:bg-gray-300 "
                    onClick={() => handleCommentClick(post._id)}
                  >
                    <MessageCircle size={18} />
                    <span>{post?.comments?.length}</span>
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                >
                  <Share2 size={18} />
                  {/* <span>{post.comments?.length}</span> */}
                </Button>
                {/* <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                >
                   <Download size={18} onClick={() => generatePDF(post)} className="bg-gray-300 p-1 rounded-md w-full h-full" />
                </Button> */}
                 <Button
                  size="sm"
                  className="flex items-center  bg-transparent hover:bg-gray-300 "
                  onClick={() => generatePDF(postRef)}
                > <Download size={18}/> </Button>
              </CardFooter>
            
            </Card>
          ))}
        </div>
    
    </>
  
  );
};

export default Posts;