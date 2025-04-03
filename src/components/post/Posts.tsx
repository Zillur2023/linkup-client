"use client";
import { useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@heroui/react";

import { useUser } from "@/context/UserProvider";
import {
  useGetUserByIdQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import { IPost } from "@/type";
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
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import { FiMessageCircle } from "react-icons/fi";
import { PiCrown } from "react-icons/pi";

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
  const [updateDislike, { isLoading: updateDislikeIsLoading }] =
    useUpdateDislikesMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const modalRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const postRef = useRef<HTMLDivElement>(null);
  const clickMessageRef = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const router = useRouter();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
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

  const { data: postData, isFetching: postIsFetching } =
    useGetAllPostQuery(queryPost);
  // const { data: postData } = useGetAllPostQuery<IPostData>({ searchQuery });

  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, boolean>
  >({});
  const [optimisticDislikes, setOptimisticDislikes] = useState<
    Record<string, boolean>
  >({});

  const handleLike = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }

    setOptimisticLikes((prev) => ({ ...prev, [postId]: true }));

    if (optimisticDislikes[postId]) {
      setOptimisticDislikes((prev) => ({ ...prev, [postId]: false }));
    }

    try {
      await updateLike({ userId: userData.data._id, postId }).unwrap();
    } catch (error) {
      setOptimisticLikes((prev) => ({ ...prev, [postId]: false }));
      toast.error("Failed to like post");
    }
  };

  const handleDislike = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }

    setOptimisticDislikes((prev) => ({ ...prev, [postId]: true }));

    if (optimisticLikes[postId]) {
      setOptimisticLikes((prev) => ({ ...prev, [postId]: false }));
    }

    try {
      await updateDislike({ userId: userData.data._id, postId }).unwrap();
    } catch (error) {
      setOptimisticDislikes((prev) => ({ ...prev, [postId]: false }));
      toast.error("Failed to dislike post");
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
      {userData &&
        postData?.data &&
        postData.data.length > 0 &&
        !searchQuery &&
        !postId && (
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

      {postData?.data?.map((post: IPost) => {
        const isLiked =
          optimisticLikes[post._id] ||
          post.likes.some((item) => item._id === userData?.data?._id);
        const isDisliked =
          optimisticDislikes[post._id] ||
          post.dislikes.some((item) => item._id === userData?.data?._id);

        let likesLength;
        let disLikesLength;

        const zillur = () => {
          if (optimisticLikes[post._id] && !optimisticDislikes[post._id]) {
            return (likesLength = post.likes.length + 1);
          } else if (
            optimisticLikes[post._id] &&
            optimisticDislikes[post._id]
          ) {
            return (disLikesLength = post.dislikes.length - 1);
          }
        };
        const zillur2 = () => {
          if (optimisticDislikes[post._id] && !optimisticLikes[post._id]) {
            return (disLikesLength = post.dislikes.length + 1);
          } else if (
            optimisticDislikes[post._id] &&
            optimisticLikes[post._id]
          ) {
            return (likesLength = post.likes.length - 1);
          }
        };
        zillur();
        zillur2();
        return (
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
                  <PiCrown size={16} /> {/* Use a crown icon or similar */}
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
                      // loading={postIsFetching || updateDislikeIsLoading}
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
                    <BiLike
                      size={24}
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
                    <BiDislike
                      size={24}
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
                    startContent={<FiMessageCircle size={24} />}
                  >
                    {post?.comments?.length}
                  </Button>
                ) : (
                  modalCommentRef
                )}
                <div className=" hidden ">
                  {userData?.data && (
                    <PostComment
                      clickRef={(el: any) =>
                        (clickMessageRef.current[post?._id] = el)
                      }
                      focusRef={(el) => (modalRef.current[post?._id] = el)}
                      user={userData?.data}
                      post={post}
                      startContent={<FiMessageCircle size={24} />}
                      openButtonText={`${post?.comments?.length}`}
                      showAllComments={showAllComments ? true : false}
                      hideComments={true}
                    />
                  )}
                </div>

                <Button
                  fullWidth
                  size="sm"
                  variant="light"
                  startContent={<PiShareFat size={24} />}
                ></Button>

                {/* <Button
                  fullWidth
                  size="sm"
                  variant="light"
                  onClick={() => generatePDF(postRef)}
                  startContent={<MdOutlineFileDownload  />}
                /> */}
              </div>
              {/* <Divider /> */}
              <div className=" w-full mt-2 ">
                {userData?.data && (
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
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Posts;
