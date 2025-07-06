import { Button } from "@heroui/react";
import React, { useEffect, useRef } from "react";
import { MdCancel, MdSettingsVoice } from "react-icons/md";
import { ReactMediaRecorder } from "react-media-recorder";

type VoiceRecorderProps = {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  isStopRecording: boolean;
  setIsStopRecording: (value: boolean) => void;
  blobUrl: any;
  setBlobUrl: (url: string | null) => void;
  setRecordTime: (time: number | ((prevTime: number) => number)) => void;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
  isStopRecording,
  setIsStopRecording,
  blobUrl,
  setBlobUrl,
  setRecordTime,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //   Recording timer
  useEffect(() => {
    if (isRecording && !isStopRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (!isRecording) {
        setRecordTime(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isStopRecording]);

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
        console.log({ status, mediaBlobUrl });
        useEffect(() => {
          if (status === "stopped") {
            stopRecording();
            setBlobUrl(mediaBlobUrl as string);
          }
        }, [status]);
        useEffect(() => {
          if (!isRecording) {
            stopRecording();
          }
        }, [isRecording]);
        // console.log("!blobUrl", !blobUrl);
        useEffect(() => {
          if (!blobUrl) {
            stopRecording();
            setIsRecording(false);
            setIsStopRecording(false);
            setBlobUrl(null);
          }
        }, [blobUrl]);
        useEffect(() => {
          if (isStopRecording) {
            stopRecording();
          }
        }, [isStopRecording]);
        return (
          <div className="">
            <div className="">
              {isRecording ? (
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="md"
                  // onClick={stopRecording}
                  onClick={() => {
                    stopRecording();
                    setIsRecording(false);
                    // setIsStopRecording(false);
                    setBlobUrl(null);
                  }}
                >
                  <MdCancel size={24} />
                </Button>
              ) : (
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="md"
                  // onClick={startRecording}
                  onClick={() => {
                    startRecording();
                    setIsRecording(true);
                  }}
                >
                  <MdSettingsVoice size={24} />
                </Button>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default VoiceRecorder;
