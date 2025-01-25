import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
// import { VerticalDotsIcon } from "../table/VerticalDotsIcon";
export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    width={width || size}
    role="presentation"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);
interface ActionButtonProps {
    onEdit?: () => Promise<void>;
    onDelete?: () => Promise<void>;
}


const ActionButton: React.FC<ActionButtonProps> = ({onEdit, onDelete}) => {

  return (
    <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  {/* <VerticalDotsIcon className="text-default-300" width={24} height={24} /> */}
                  <EllipsisVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={onEdit} key="edit">Edit</DropdownItem>
                <DropdownItem onClick={onDelete} key="logout" className="text-danger" color="danger">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
  )
}

export default ActionButton