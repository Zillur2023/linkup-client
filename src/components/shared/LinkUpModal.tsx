import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@heroui/modal";
import { ThumbsUp } from "lucide-react";
import { ReactNode } from "react";

interface IProps {
  openButtonText?: ReactNode;
  openButtonIcon?: ReactNode;
  actionButtonText?: string;
  title?: string;
  children: ReactNode;
  radius?: "sm" | "md" | "lg" | "full" | "none" | undefined;
  variant?:
    | "light"
    | "solid"
    | "bordered"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
  modalSize?:
    | "sm"
    | "md"
    | "lg"
    | "xs"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
  buttonSize?: "sm" | "md" | "lg" | undefined;
  className?: string;
  onUpdate?: () => void;
  startContent?: ReactNode;
  footerButton?: boolean;
}

export default function LinkUpModal({
  openButtonText,
  openButtonIcon,
  actionButtonText,
  title,
  children,
  radius,
  variant = "light",
  modalSize,
  buttonSize = "sm",
  className,
  onUpdate,
  startContent,
  footerButton = false,
}: IProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {openButtonIcon
        ? openButtonIcon && (
            <Button isIconOnly size="sm" variant={variant} onPress={onOpen}>
              {openButtonIcon}
            </Button>
          )
        : openButtonText && (
            <Button
              size={buttonSize}
              radius={radius}
              variant={variant}
              fullWidth
              className={className}
              onPress={onOpen}
            >
              {openButtonText}
            </Button>
            // <div onClick={onOpen}>{openButtonText}</div>
          )}

      {/* <Button
          size={buttonSize}
          radius={radius}
          variant={variant}
          fullWidth
          className={
            // openButtonText ? "flex items-center justify-start" : undefined
            // textButtonClassName ? textButtonClassName : iconButtonClassName
            className
          }
          isIconOnly={!!openButtonIcon}
          startContent={startContent}
          onPress={onOpen}
        >
          {openButtonIcon || openButtonText}
        </Button> */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={modalSize}>
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex justify-center ">
                  {title}
                </ModalHeader>
              )}
              <ModalBody className=" flex items-center justify-center ">
                {children}
              </ModalBody>

              {footerButton && (
                <ModalFooter>
                  <Button color="danger" size="sm" onPress={onClose}>
                    Close
                  </Button>

                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => {
                      if (onUpdate) onUpdate();
                      // onClose();
                    }}
                  >
                    {actionButtonText}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
