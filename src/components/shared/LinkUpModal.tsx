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
  title?: string ;
  children: ReactNode;
  variant?:
    | "light"
    | "solid"
    | "bordered"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
  ClassName?: string;
  openButton?:ReactNode

}

export default function LinkUpModal({
  openButtonText,
  title,
  children,
  variant = "light",
  ClassName,
  openButton,
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
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} > 
        <ModalContent>
          {(onClose) => (
            <>
              { title && <ModalHeader className="flex flex-col py-2 text-center">{title}</ModalHeader> }
              <ModalBody className="overflow-y-auto max-h-auto">{children}</ModalBody>
             {/* {
                <ModalFooter>
              <Button color="danger" size="sm" variant="light" onPress={onClose}>
                Close
              </Button>
              
              <Button color="primary" size="sm" onPress={() => {
                 Update
              </Button>
            </ModalFooter>
             } */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
