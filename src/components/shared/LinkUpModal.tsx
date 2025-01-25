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
  openButtonText?: string;
  actionButtonText?: string;
  title: string | ReactNode;
  children: ReactNode;
  variant?:
    | "light"
    | "solid"
    | "bordered"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
  ClassName?: string;
  openButton?:ReactNode
  onUpdate?: () =>  void; 
  footerButton?: boolean

}

export default function LinkUpModal({
  openButtonText,
  actionButtonText="Update",
  title,
  children,
  variant = "light",
  ClassName,
  onUpdate,
  openButton,
  footerButton = true
}: IProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
   
      {openButton?  
          <div onClick={onOpen}>{openButton}</div>
         : <Button
        className={ClassName}
        variant={variant}
        onPress={onOpen}
      >
        {openButtonText}
      </Button>}
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}  > 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="overflow-y-auto max-h-auto">{children}</ModalBody>
             {
              footerButton &&  <ModalFooter>
              <Button color="danger" size="sm" variant="light" onPress={onClose}>
                Close
              </Button>
              
              <Button color="primary" size="sm" onPress={() => {
                  if (onUpdate) {
                    onUpdate();
                  }
                  // onClose();
                }}>
                {actionButtonText}
              </Button>
            </ModalFooter>
             }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
