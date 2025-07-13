"use client";
import { useUser } from "@/context/UserProvider";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { IPost, IUser } from "@/type";
import { Button, Tooltip } from "@heroui/react";
import { ReactNode } from "react";

interface ReactionButtonProps {
  onClick?: () => void; // Async function for handling the button action
  reactionType?: "likes" | "dislikes"; // Unique identifier for each button
  children: ReactNode;
  post?: IPost;
  className?: string;
  startContent?: ReactNode;
}

const ReactionButton = ({
  onClick,
  reactionType,
  children,
  post,
  className,
  startContent,
}: ReactionButtonProps) => {
  const { user } = useUser();
  const reactions = useAppSelector((state: RootState) => state.reactions);

  const handleClick = async () => {
    if (!onClick) return; // Exit if onClick is undefined

    try {
      await onClick();
    } finally {
    }
  };

  return (
    <>
      {reactionType &&
      reactions?.[reactionType][post?._id as string]?.length ? (
        <Tooltip
          content={
            <div className="whitespace-pre-wrap">
              {/* {data
                ?.map((item) => (item?._id === user?._id ? "You" : item?.name))
                .join("\n")} */}

              {reactions?.[reactionType][post?._id as string]?.includes(
                user?._id as string
              ) && <p> {"You"} </p>}
              <p>
                {post?.[reactionType]
                  ?.map((item: IUser) =>
                    item?._id === user?._id ? "" : item?.name
                  )
                  .join("\n")}
              </p>
            </div>
          }
          closeDelay={0}
          placement="bottom"
        >
          <Button
            fullWidth
            size="sm"
            onClick={handleClick}
            className={
              !className
                ? "flex items-center gap-3 bg-transparent hover:bg-gray-300 "
                : className
            }
            startContent={startContent}
          >
            {children}
          </Button>
        </Tooltip>
      ) : (
        <Button
          fullWidth
          size="sm"
          onClick={handleClick}
          variant="light"
          className={className}
          startContent={startContent}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default ReactionButton;
