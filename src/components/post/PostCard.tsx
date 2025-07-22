// components/ui/post/PostCard.tsx
import React, { useRef } from "react";
import { Card, CardBody, CardFooter, CardHeader, Button } from "@heroui/react";
import { IPost, IUser } from "@/type";
import PostHeader from "./PostHeader"; // New/Existing component
import PostActions from "./PostActions"; // New/Existing component
import { FiMessageCircle } from "react-icons/fi";
import { ImageGallery } from "@/components/shared/ImageGallery";
import Comment from "./Comment";

interface PostCardProps {
  post: IPost;
  userData: IUser | undefined;
  handleUpdateFollowUnfollow: (id: string) => void;
  handleDelete: (postId: string) => void;
  triggerDebouncedEmit: (postId: string) => void;
  showAllComments?: boolean;
  modalCommentRef?: React.ReactNode;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  userData,
  handleUpdateFollowUnfollow,
  handleDelete,
  triggerDebouncedEmit,
  showAllComments,
  modalCommentRef,
}) => {
  const clickMessageRef = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const modalRef = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const handleCommentButtonClick = (postId: string) => {
    clickMessageRef.current[postId]?.click();
  };

  return (
    <Card
      radius="none"
      key={post._id}
      shadow={modalCommentRef ? "none" : "md"}
      className={` ${
        modalCommentRef ? "!px-0" : ""
      } sm:rounded-none md:rounded-md `}
    >
      <CardHeader
        className={` ${
          modalCommentRef ? "!px-0" : ""
        }flex flex-col justify-start items-start relative `}
      >
        <PostHeader
          post={post}
          userData={userData}
          handleUpdateFollowUnfollow={handleUpdateFollowUnfollow}
          handleDelete={handleDelete}
        />
      </CardHeader>

      <CardBody className={"!px-0"}>
        <p className="mb-3 px-4 text-medium">{post?.content}</p>
        {post?.images && <ImageGallery images={post?.images} />}
      </CardBody>

      <CardFooter
        className={` ${modalCommentRef ? "!px-0" : ""} flex flex-col `}
      >
        <PostActions
          post={post}
          triggerDebouncedEmit={triggerDebouncedEmit}
          modalCommentRef={modalCommentRef}
          onCommentButtonClick={handleCommentButtonClick}
        />

        {/* This hidden div holds the Comment component and its modal trigger */}
        <div className=" hidden ">
          {userData && (
            <Comment
              clickRef={(el: any) => (clickMessageRef.current[post?._id] = el)}
              focusRef={(el) => (modalRef.current[post?._id] = el)}
              user={userData}
              post={post}
              startContent={<FiMessageCircle size={24} />}
              openButtonText={`${post?.comments?.length}`}
              showAllComments={showAllComments ? true : false}
            />
          )}
        </div>

        <div className=" w-full mt-2 ">
          {/* This renders the comments below the post card, if applicable */}
          {userData && (
            <Comment
              user={userData}
              post={{
                ...post,
                comments: post.comments,
              }}
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
};

export default PostCard;
