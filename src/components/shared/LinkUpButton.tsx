"use client";
import { useUser } from "@/context/UserProvider";
import { IUser } from "@/type";
import { Button, Spinner, Tooltip } from "@heroui/react";
import { ReactNode, useState } from "react";

interface LinkUpButtonProps {
  onClick?: () => Promise<void>; // Async function for handling the button action
  buttonId: string; // Unique identifier for each button
  children: ReactNode;
  data?: IUser[];
  className?: string;
  startContent?: ReactNode;
}

const LinkUpButton: React.FC<LinkUpButtonProps> = ({
  onClick,
  buttonId,
  children,
  data,
  className,
  startContent,
}) => {
  const { user } = useUser();
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleClick = async () => {
    if (!onClick) return; // Exit if onClick is undefined

    setLoadingStates((prev) => ({ ...prev, [buttonId]: true })); // Set loading for the specific button
    try {
      await onClick();
    } finally {
      setLoadingStates((prev) => ({ ...prev, [buttonId]: false })); // Reset loading for the button
    }
  };

  return (
    <>
      {data?.length ? (
        <Tooltip
          content={
            <div className="whitespace-pre-wrap">
              {data
                ?.map((item) => (item?._id === user?._id ? "You" : item?.name))
                .join("\n")}
            </div>
          }
          closeDelay={0}
          placement="bottom"
        >
          <Button
            fullWidth
            size="sm"
            onClick={handleClick}
            disabled={loadingStates[buttonId]}
            className={
              !className
                ? "flex items-center gap-3 bg-transparent hover:bg-gray-300 "
                : className
            }
            startContent={loadingStates[buttonId] ? "" : startContent}
          >
            {loadingStates[buttonId] ? (
              <Spinner size="sm"></Spinner>
            ) : (
              <> {children} </>
            )}
          </Button>
        </Tooltip>
      ) : (
        <Button
          fullWidth
          size="sm"
          onClick={handleClick}
          disabled={loadingStates[buttonId]}
          variant="light"
          className={className}
          startContent={loadingStates[buttonId] ? "" : startContent}
        >
          {loadingStates[buttonId] ? (
            <Spinner size="sm"></Spinner>
          ) : (
            <> {children} </>
          )}
        </Button>
      )}
    </>
  );
};

export default LinkUpButton;
