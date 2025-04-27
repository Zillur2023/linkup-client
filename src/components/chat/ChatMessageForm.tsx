import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Textarea, Button, Card } from "@heroui/react";
import { MdAddCircle } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useRef, useState } from "react";
import { ISelectedUser } from "../common/UsersList";
import { useSocketContext } from "@/context/socketContext";

type TFormValues = {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
};

interface ChatMessageFormProps {
  onSubmit: (content: TFormValues & { reset: () => void }) => void;
  selectedUser: ISelectedUser | null;
}

const ChatMessageForm = ({ onSubmit, selectedUser }: ChatMessageFormProps) => {
  const methods = useForm<TFormValues>();
  const { socket } = useSocketContext();
  const { register, handleSubmit, reset, setValue, control } = methods;
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSendingTyping, setIsSendingTyping] = useState(false);

  const textValue = useWatch({
    control,
    name: "text",
    defaultValue: "",
  });

  const emitTypingStart = () => {
    if (selectedUser?._id && socket && !isSendingTyping) {
      setIsSendingTyping(true);
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  const emitTypingStop = () => {
    if (selectedUser?._id && socket && isSendingTyping) {
      setIsSendingTyping(false);
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue("text", text);

    if (selectedUser?._id && socket) {
      if (text.trim().length > 0 && !isSendingTyping) {
        emitTypingStart();
      } else if (text.trim().length === 0 && isSendingTyping) {
        emitTypingStop();
      }

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      typingTimeout.current = setTimeout(() => {
        if (isSendingTyping && text.trim().length > 0) {
          emitTypingStop();
        }
      }, 3000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmitForm)();
    }
  };

  const onSubmitForm = (data: TFormValues) => {
    // Validate at least one field is present
    if (!data.text && !data.imageUrl && !data.videoUrl) {
      methods.setError("root", {
        type: "manual",
        message: "Please provide either text, image, or video",
      });
      return;
    }
    onSubmit({ ...data, reset });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Card shadow="none" className="relative w-full">
          <Textarea
            {...register("text", { onChange: handleTextChange })}
            minRows={1}
            placeholder="Aa"
            size="sm"
            fullWidth
            onKeyDown={handleKeyDown}
            variant="flat"
            radius="full"
            className="mx-auto w-[75%]"
            classNames={{
              inputWrapper: "shadow-none",
              input: "",
            }}
          />
          <Button
            isDisabled
            isIconOnly
            variant="light"
            size="sm"
            radius="full"
            className="absolute bottom-0 left-0"
          >
            <MdAddCircle size={20} />
          </Button>
          <Button
            type="submit"
            isIconOnly
            variant="light"
            size="sm"
            radius="full"
            className="absolute bottom-0 right-0"
            isDisabled={!textValue?.trim()}
          >
            <IoSend size={16} />
          </Button>
        </Card>
      </form>
    </FormProvider>
  );
};

export default ChatMessageForm;
