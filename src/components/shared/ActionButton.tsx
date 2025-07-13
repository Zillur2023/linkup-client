import { IPost } from "@/type";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { VscEllipsis } from "react-icons/vsc";
import { useRef } from "react";
import PostEditor from "../post/PostEditor";
import LinkUpModal from "./LinkUpModal";

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  confirmDelete?: () => void;
  post?: IPost;
}

const ActionButton = ({
  onEdit,
  onDelete,
  confirmDelete,
  post,
}: ActionButtonProps) => {
  const editRef = useRef<HTMLButtonElement | null>(null);
  const deleteRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" radius="full" variant="light">
            <VscEllipsis size={24} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="edit"
            onClick={() => {
              if (onEdit) {
                onEdit(); // Call onEdit if provided
              } else if (post) {
                editRef.current?.click(); // Trigger the hidden button
              }
            }}
          >
            {"Edit"}
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={() => {
              if (onDelete) {
                onDelete();
              } else if (post) {
                deleteRef.current?.click();
              }
            }}
          >
            {"Delete"}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Show PostEditor only when editing */}
      <div className=" hidden">
        <PostEditor clickRef={editRef} post={post} openButtonText="Edit" />
      </div>
      <div className=" hidden">
        <LinkUpModal
          className="min-h-[10vh]"
          clickRef={deleteRef}
          modalSize={"xs"}
          variant="ghost"
          footerButton={true}
          openButtonText={"Delete"}
          actionButtonText="Delete"
          onUpdate={confirmDelete}
        >
          <p className=" mt-5  text-red-500 font-semibold text-medium flex items-center justify-center ">
            Are your sure to delete this post
          </p>
        </LinkUpModal>
      </div>
    </div>
  );
};

export default ActionButton;
