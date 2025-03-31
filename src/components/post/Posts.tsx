"use client";
import { useRef } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@heroui/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Crown,
} from "lucide-react";
import { useUser } from "@/context/UserProvider";
import {
  useGetUserByIdQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import { IPost, IPostData, IUserData } from "@/type";
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
import { useRouter } from "next/navigation";
import { ImageGallery } from "../shared/ImageGallery";
import PostEditor from "./PostEditor";
import PostComment from "./PostComment";
import ActionButton from "../shared/ActionButton";
import { formatPostDate, formatPostTooltipDate } from "@/uitls/formatDate";

interface PostsProps {
  postId?: string;
  userId?: string;
  showAllComments?: boolean;
  searchQuery?: string;
  modalCommentRef?: any;
}

const Posts: React.FC<PostsProps> = ({
  postId,
  userId,
  showAllComments = false,
  searchQuery,
  modalCommentRef,
}) => {
  const [updateLike] = useUpdateLikesMutation();
  const [updateDislike] = useUpdateDislikesMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const modalRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const postRef = useRef<HTMLDivElement>(null);
  const clickMessageRef = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });
  // const debounceSearchQuery = useDebounce(searchQuery);

  const queryPost = postId
    ? { postId }
    : {
        userId,
        // searchQuery: debounceSearchQuery,
        searchQuery,
        // sortBy,
        isPremium: userData?.data?.isVerified ? true : undefined,
      };

  const { data: postData } = useGetAllPostQuery<IPostData>(queryPost);
  // const { data: postData } = useGetAllPostQuery<IPostData>({ searchQuery });
  console.log({ postData });

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
      await updateFollowUnfollow({
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
    <div className=" space-y-5 ">
      {userData && postData?.data?.length > 0 && !searchQuery && !postId && (
        <Card className=" flex flex-row items-center justify-center gap-2 p-3 ">
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
        </Card>
      )}
      {!postData && <PostSkeleton />}

      {postData?.data?.map((post: IPost) => (
        <Card
          ref={postRef}
          key={post._id}
          shadow={postId ? "none" : "md"}
          className={` ${postId ? "!px-0" : ""} `}
        >
          {/* Author Info */}
          <CardHeader
            className={` ${
              postId ? "!px-0" : ""
            }flex flex-col justify-start items-start relative `}
          >
            {post?.isPremium && (
              <div className="absolute top-14 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                <Crown size={16} /> {/* Use a crown icon or similar */}
                <span className="text-sm font-medium">Premium</span>
              </div>
            )}

            <div className=" w-full flex justify-between items-center ">
              <Author
                author={post?.author}
                // description={formatPostDate(post?.createdAt)}
                description={
                  <Tooltip content={formatPostTooltipDate(post?.createdAt)}>
                    {formatPostDate(post?.createdAt)}
                  </Tooltip>
                }
              />
              <div className="flex items-center gap-3">
                {post?.author?._id !== userData?.data?._id && (
                  <LinkUpButton
                    onClick={() =>
                      handleUpdateFollowUnfollow(post?.author?._id as string)
                    }
                    buttonId="followOrUnfollow"
                  >
                    {userData?.data?.following?.includes(
                      post?.author?._id as string
                    )
                      ? "Unfollow"
                      : "Follow"}
                  </LinkUpButton>
                )}
                {post?.author?._id === userData?.data?._id && (
                  <ActionButton
                    post={post}
                    confirmDelete={() => handleDelete(post?._id)}
                  />
                )}
              </div>
            </div>
            <div className=" w-full flex justify-end items-center "></div>
          </CardHeader>
          <CardBody className={` ${postId ? "!px-0" : ""}`}>
            <p className="mb-3 text-medium ">{post?.content}</p>

            {post?.images && <ImageGallery images={post?.images} />}
          </CardBody>

          <CardFooter className={` ${postId ? "!px-0" : ""} flex flex-col `}>
            {/* <Divider /> */}
            <div className=" w-full flex justify-between pl-[10%] pr-[10%]   ">
              <LinkUpButton
                onClick={() => handleLike(post._id)}
                buttonId="like"
                data={post?.likes}
                startContent={
                  <ThumbsUp
                    className={`${
                      post?.likes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                }
              >
                <span>{post.likes.length}</span>
              </LinkUpButton>

              <LinkUpButton
                onClick={() => handleDislike(post._id)}
                buttonId="dislike"
                data={post?.dislikes}
                startContent={
                  <ThumbsDown
                    className={`${
                      post?.dislikes?.some(
                        (item) => item?._id === userData?.data?._id
                      )
                        ? "text-blue-600 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                }
              >
                <span>{post.dislikes.length}</span>
              </LinkUpButton>

              {!modalCommentRef ? (
                <Button
                  fullWidth
                  onClick={() => clickMessageRef.current[post?._id]?.click()}
                  // onClick={() => clickMessageRef.current?.click()}
                  size="sm"
                  variant="light"
                  startContent={<MessageCircle />}
                >
                  {post?.comments?.length}
                </Button>
              ) : (
                modalCommentRef
              )}
              <div className=" hidden ">
                <PostComment
                  clickRef={(el: any) =>
                    (clickMessageRef.current[post?._id] = el)
                  }
                  focusRef={(el) => (modalRef.current[post?._id] = el)}
                  user={userData?.data}
                  post={post}
                  startContent={<MessageCircle />}
                  openButtonText={`${post?.comments?.length}`}
                  showAllComments={showAllComments ? true : false}
                  hideComments={true}
                />
              </div>

              <Button
                fullWidth
                size="sm"
                variant="light"
                startContent={<Share2 />}
              ></Button>

              {/* <Button
                fullWidth
                size="sm"
                variant="light"
                onClick={() => generatePDF(postRef)}
                startContent={<Download />}
              /> */}
            </div>
            {/* <Divider /> */}
            <div className=" w-full mt-2 ">
              <PostComment
                user={userData?.data}
                post={post}
                openButtonText={
                  post?.comments?.length > 2 &&
                  !showAllComments &&
                  "See all comment"
                }
                showAllComments={showAllComments ? true : false}
                focusRef={(el) => (modalRef.current[post?._id] = el)}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Posts;
