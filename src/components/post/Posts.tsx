"use client";
import { useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Trash2,
  Pencil,
  Download,
  Crown,
} from "lucide-react";
import { useUser } from "@/context/UserProvider";
import {
  useGetUserByIdQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import { IPostData, IUserData } from "@/type";
import useDebounce from "@/hooks/debounce.hooks";
import {
  useDeletePostMutation,
  useGetAllPostQuery,
  useUpdateDislikesMutation,
  useUpdateLikesMutation,
} from "@/redux/features/post/postApi";
import { toast } from "sonner";
import { PostSkeleton } from "../shared/Skeleton";
import Author from "../shared/Author";
import LinkUpButton from "../shared/LinkUpButton";
import LinkUpModal from "../shared/LinkUpModal";
import { generatePDF } from "@/uitls/generatePDF";
import { useRouter } from "next/navigation";
import { ImageGallery } from "../shared/ImageGallery";
import PostEditor from "./PostEditor";
import PostComment from "./PostComment";

interface PostsProps {
  postId?: string;
  comment?: boolean;
}

const Posts: React.FC<PostsProps> = ({ postId, comment = true }) => {
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  // console.log("POstUSerData", userData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const debounceSearch = useDebounce(searchTerm);

  const queryPost = postId
    ? { postId }
    : {
        // searchTerm,
        searchTerm: debounceSearch,
        sortBy,
        isPremium: userData?.data?.isVerified ? true : undefined,
      };
  const { data: postData } = useGetAllPostQuery<IPostData>(queryPost);
  // console.log({ postData });

  const [updateLike] = useUpdateLikesMutation();
  const [updateDislike] = useUpdateDislikesMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const inputRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const postRef = useRef<HTMLDivElement>(null); // Ref for the div to be converted to PDF

  const handleCommentClick = (postId: string) => {
    inputRef?.current[postId]?.focus();
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
      <div className="  mx-auto space-y-3">
        {userData && (
          <div className=" flex items-center justify-center gap-2 my-3 px-1">
            <Avatar
              radius="full"
              src={userData?.data?.profileImage}
              // size="md"
            />
            <PostEditor
              openButtonText={`What's on your mind, ${userData?.data?.name}`}
              size="md"
              radius="full"
            />
          </div>
        )}
        {!postData && <PostSkeleton />}

        {postData?.data?.map((post) => (
          <Card
            ref={postRef}
            key={post._id}
            isFooterBlurred
            className=" w-full p-5 "
          >
            {/* Author Info */}
            <CardHeader className=" flex flex-col justify-start items-start relative ">
              {post?.isPremium && (
                <div className="absolute top-14 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Crown size={16} /> {/* Use a crown icon or similar */}
                  <span className="text-sm font-medium">Premium</span>
                </div>
              )}

              <div className=" w-full flex justify-between items-center ">
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
                      openButtonIcon={<Pencil />}
                    />
                    // <ActionButton/>
                  )}

                  {post?.author?._id === userData?.data?._id && (
                    <LinkUpModal
                      modalSize={"xs"}
                      variant="ghost"
                      footerButton={true}
                      openButtonIcon={<Trash2 className=" text-red-400" />}
                      actionButtonText="Delete"
                      onUpdate={() => handleDelete(post?._id)}
                    >
                      <p className=" mt-5  text-red-500 font-semibold text-medium flex items-center justify-center ">
                        Are your sure to delete this post
                      </p>
                    </LinkUpModal>
                  )}
                </div>
              </div>
              <div className=" w-full flex justify-end items-center "></div>
            </CardHeader>
            <CardBody>
              <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: post?.content,
                }}
              ></p>

              {/* Post Image */}
              {post?.images && <ImageGallery images={post?.images} />}

              {/* Post Content */}
              {/* <p className="my-5">{post.content}</p> */}
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
              >
                {" "}
                <Download size={18} />{" "}
              </Button>
            </CardFooter>

            <PostComment
              postId={post?._id}
              openButtonText={
                post?.comments?.length > 2 && comment && "See all comment"
              }
              comment={comment ? true : false}
              focusRef={(el) => (inputRef.current[post._id] = el)}
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default Posts;
