import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@heroui/modal";
import {
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpTextarea from "../form/LinkUpTextarea";
import { SendHorizontal } from "lucide-react";

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
  fullWidth?: boolean;
  className?: string;
  onUpdate?: () => void;
  startContent?: ReactNode;
  footerButton?: boolean;
  footer?: ReactNode;
  scrollBehavior?: "inside" | "normal" | "outside" | undefined;
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
  fullWidth = true,
  className,
  onUpdate,
  startContent,
  footerButton = false,
  footer,
  scrollBehavior,
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
              startContent={startContent}
              fullWidth={fullWidth}
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={modalSize}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex flex-col items-center justify-center ">
                  {title}
                </ModalHeader>
              )}
              <ModalBody className="  ">{children}</ModalBody>

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
              {footer && (
                <ModalFooter>
                  <div className="  w-full ">{footer}</div>
                </ModalFooter>
              )}
              {/* {footer && <ModalFooter>{renderFooter()}</ModalFooter>} */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
