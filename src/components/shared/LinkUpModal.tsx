import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@heroui/modal";
import { ReactNode } from "react";

interface IProps {
  openButtonText?: ReactNode;
  startContent?: ReactNode;
  openButtonIcon?: ReactNode;
  actionButtonText?: string;
  header?: ReactNode;
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
  footerButton?: boolean;
  footer?: ReactNode;
  scrollBehavior?: "inside" | "normal" | "outside" | undefined;
  clickRef?: any;
  backdrop?: "transparent" | "opaque" | "blur" | undefined;
}

export default function LinkUpModal({
  startContent,
  openButtonText,
  openButtonIcon,
  actionButtonText,
  header,
  children,
  radius,
  variant = "light",
  modalSize,
  buttonSize = "sm",
  fullWidth = true,
  className,
  onUpdate,
  footerButton = false,
  footer,
  scrollBehavior,
  clickRef,
  backdrop,
}: IProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {openButtonIcon
        ? openButtonIcon && (
            <Button isIconOnly size="sm" variant={variant} onClick={onOpen}>
              {openButtonIcon}
            </Button>
          )
        : openButtonText && (
            <Button
              ref={clickRef}
              // as={"div"}
              size={buttonSize}
              radius={radius}
              variant={variant}
              startContent={startContent}
              fullWidth={fullWidth}
              className={`${className} `}
              onClick={onOpen}
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
          onClick={onOpen}
        >
          {openButtonIcon || openButtonText}
        </Button> */}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={modalSize}
        // className=" h-full "
        scrollBehavior={scrollBehavior}
        backdrop={backdrop}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {header && (
                <ModalHeader className="flex flex-col items-center justify-center ">
                  <div>{header}</div>
                </ModalHeader>
              )}
              <ModalBody className="  ">{children}</ModalBody>

              {footerButton && (
                <ModalFooter>
                  <Button color="danger" size="sm" onClick={onClose}>
                    Close
                  </Button>

                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      if (onUpdate) onUpdate();
                      // onClose();
                    }}
                  >
                    {actionButtonText}
                  </Button>
                </ModalFooter>
              )}
              {footer && <ModalFooter>{footer}</ModalFooter>}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
