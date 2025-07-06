import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  Textarea,
  Button,
  Card,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { MdAddCircle, MdSettingsVoice } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { ISelectedUser } from "../common/UsersList";
import { useSocketContext } from "@/context/socketContext";
import image from "../../../public/likeButton.png";
import Image from "next/image";
import { IoMdImages } from "react-icons/io";
import { PiGifFill } from "react-icons/pi";
import { LuSticker } from "react-icons/lu";
import VoiceRecorder from "./VoiceRecorder";
import EmojiPickerButton from "./EmojiPickerButton";
import { AudioPlayerControls } from "./AudioPlayerControls";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import ImageUploader from "./ImageUploader ";
import { useAppSelector } from "@/redux/hooks";
import { selectDrawerStatus } from "@/redux/features/chat/chatSlice";

type TFormValues = {
  text?: string;
  images?: File[];
  voice?: string;
};

interface ChatMessageFormProps {
  onSubmit: (
    content: TFormValues & { like?: boolean; reset: () => void }
  ) => void;
  selectedUser: ISelectedUser | null;
}

const ChatMessageForm = ({ onSubmit, selectedUser }: ChatMessageFormProps) => {
  const methods = useForm<TFormValues>();
  const { socket } = useSocketContext();
  const { register, handleSubmit, reset, setValue, control } = methods;
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSendingTyping, setIsSendingTyping] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isStopRecording, setIsStopRecording] = useState(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState(60);
  const uploaderRef = useRef<HTMLInputElement>(null);

  const isChatDrawerOpen = useAppSelector(
    selectDrawerStatus(selectedUser?._id as string)
  );

  // console.log({ selectedUser, isRecording, blobUrl, isStopRecording });
  const handleUploadClick = () => {
    uploaderRef.current?.click();
  };

  const {
    audioRef,
    isPlaying,
    isPause,
    currentPlayTime,
    togglePlay,
    handlePlaybackEnd,
  } = useAudioPlayer(blobUrl, maxDuration);

  const textValue = useWatch({
    control,
    name: "text",
    // defaultValue: "",
  });
  const watchImage = useWatch({
    control,
    name: "images",
    // defaultValue: "",
  });
  // console.log({ textValue });
  // console.log({ watchImage });

  // Set max duration when recording stops
  useEffect(() => {
    if (isStopRecording) {
      setMaxDuration(recordTime);
      // setCurrentPlayTime(recordTime);
    }
  }, [isStopRecording]);

  // // Reset audio states when new recording starts
  useEffect(() => {
    if (isRecording) {
      setRecordTime(0);
      setMaxDuration(60);
    }
  }, [isRecording]);

  useEffect(() => {
    if (!isChatDrawerOpen) {
      setBlobUrl(null);
    }
  }, [isChatDrawerOpen]);
  console.log({ isChatDrawerOpen });
  useEffect(() => {
    if (blobUrl) {
      setValue("voice", blobUrl);
    }
  }, [blobUrl]);

  // Format time display (MM:SS)
  const formatRecordTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
    setValue("text", text.trim());

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

  useEffect(() => {
    if (watchImage?.length) {
      setValue("images", watchImage);
    }
  }, [watchImage?.length, setValue]);

  const onSubmitForm = (data: any) => {
    console.log({ data });
    if (data.text.length && data.images.length) {
      onSubmit({ text: data?.text?.trim(), images: data.images, reset });
    } else if (data.text) {
      onSubmit({ text: data?.text?.trim(), reset });
    } else if (data.images.length) {
      onSubmit({ images: data.images, reset });
    } else if (data.voice) {
      onSubmit({ voice: data.voice, reset });
    } else {
      onSubmit({ like: true, reset });
    }

    // reset();
    reset({ text: "", images: [], voice: "" });
    setIsRecording(false);
    setBlobUrl(null);
    setIsStopRecording(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Card shadow="none" className="relative w-full py-1 ">
          <div className="flex justify-end mr-12  relative border-2  ">
            {/* Progress bar - shows during recording OR playback */}
            {(isRecording || isPlaying) && (
              <div
                className={`absolute bottom-0 h-10 bg-blue-500 overflow-hidden z-10 rounded-full transition-all duration-300 ${
                  textValue || isRecording
                    ? "w-[80%] md:w-[86%]"
                    : "w-[30%] md:w-[50%]"
                }`}
              >
                <div
                  className="h-full  bg-blue-400 transition-all duration-[50ms]"
                  style={{
                    width: `${
                      isPlaying || isPause
                        ? 100 - (currentPlayTime / recordTime) * 100
                        : (recordTime / maxDuration) * 100
                    }%`,
                  }}
                />
              </div>
            )}
            <div
              className={`  absolute ${
                // textValue ? "w-[80%] md:w-[86%]" : "w-[30%] md:w-[50%]"
                watchImage?.length
                  ? "w-[80%] md:w-[86%]"
                  : "w-[80%] md:w-[50%] hidden"
              } `}
            >
              <ImageUploader name="images" ref={uploaderRef} />
            </div>
            <Textarea
              {...register("text", { onChange: handleTextChange })}
              minRows={1}
              placeholder={!isRecording ? "Aa" : ""}
              size="md"
              fullWidth
              onKeyDown={handleKeyDown}
              // radius="full"
              className={` ${
                watchImage?.length ? "pt-16 bg-default-100 rounded-md  " : " "
              } 
                ${
                  textValue || isRecording || watchImage?.length
                    ? "w-[80%] md:w-[86%]"
                    : "w-[30%] md:w-[50%]"
                }
              `}
              value={textValue}
              classNames={{
                inputWrapper: ` rounded-full shadow-none  ${
                  isRecording ? "!bg-blue-500" : "!bg-default-100  "
                  // isRecording ? "!bg-blue-500" : "!bg-transparent  "
                } `,
                input: "",
              }}
              startContent={
                isRecording && (
                  <AudioPlayerControls
                    isStopRecording={isStopRecording}
                    isPlaying={isPlaying}
                    blobUrl={blobUrl}
                    audioRef={audioRef}
                    togglePlay={togglePlay}
                    setIsStopRecording={setIsStopRecording}
                    handlePlaybackEnd={handlePlaybackEnd}
                  />
                )
              }
              endContent={
                isRecording || (isStopRecording && blobUrl) ? (
                  <button className="bg-white rounded-full text-blue-500 text-sm px-2 z-40">
                    {isPlaying || isPause
                      ? formatRecordTime(Math.floor(currentPlayTime))
                      : formatRecordTime(
                          isRecording ? recordTime : maxDuration
                        )}
                  </button>
                ) : (
                  <EmojiPickerButton
                    onEmojiSelect={(emoji) => {
                      const currentText = methods.getValues("text") || "";
                      methods.setValue("text", `${currentText}${emoji}`);
                    }}
                  />
                )
              }
            />
          </div>

          <div className="absolute bottom-1 left-0 flex gap-0">
            {textValue || watchImage?.length ? (
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="md" radius="full">
                    <MdAddCircle size={24} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Extras" variant="flat">
                  <DropdownItem
                    key="voice"
                    startContent={<MdSettingsVoice size={24} />}
                  >
                    Send a voice clip
                  </DropdownItem>

                  <DropdownItem
                    key="file"
                    startContent={<IoMdImages size={24} />}
                  >
                    Attach a file
                  </DropdownItem>
                  <DropdownItem
                    key="sticker"
                    startContent={<LuSticker size={24} />}
                    isDisabled
                  >
                    Choose a sticker
                  </DropdownItem>
                  <DropdownItem
                    key="gif"
                    startContent={<PiGifFill size={24} />}
                    isDisabled
                  >
                    Choose a GIF
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <>
                <VoiceRecorder
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  blobUrl={blobUrl}
                  setBlobUrl={setBlobUrl}
                  isStopRecording={isStopRecording}
                  setIsStopRecording={setIsStopRecording}
                  setRecordTime={setRecordTime}
                />

                {!isRecording && (
                  <>
                    <Button
                      onClick={handleUploadClick}
                      isIconOnly
                      variant="light"
                      size="md"
                      radius="full"
                    >
                      <IoMdImages size={24} />
                    </Button>

                    <Button isIconOnly variant="light" size="md" radius="full">
                      <LuSticker size={24} />
                    </Button>
                    <Button isIconOnly variant="light" size="md" radius="full">
                      <PiGifFill size={24} />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <Button
            type="submit"
            isIconOnly
            variant="light"
            size="md"
            radius="full"
            className="absolute bottom-1 right-0"
          >
            {textValue?.trim() || isRecording || watchImage?.length ? (
              <IoSend size={20} className="text-blue-500" />
            ) : (
              <Image src={image} width={24} height={24} alt="Like button" />
            )}
          </Button>
        </Card>
      </form>
    </FormProvider>
  );
};

export default ChatMessageForm;
