import React, { useEffect, useRef } from "react";
import { MdCancel, MdSettingsVoice } from "react-icons/md";
import { Button } from "@heroui/react";

type VoiceRecorderProps = {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  isStopRecording: boolean;
  setIsStopRecording: (value: boolean) => void;
  blobUrl: string | null;
  setBlobUrl: (url: string | null) => void;
  setRecordTime: (time: number | ((prevTime: number) => number)) => void;
};

const VoiceRecorder = ({
  isRecording,
  setIsRecording,
  isStopRecording,
  setIsStopRecording,
  blobUrl,
  setBlobUrl,
  setRecordTime,
}: VoiceRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCancelledRef = useRef(false);

  // Timer control
  useEffect(() => {
    if (isRecording && !isStopRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isRecording) setRecordTime(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isStopRecording]);

  // Stop recording if externally triggered
  useEffect(() => {
    if (isStopRecording) {
      handleStopRecording();
    }
  }, [isStopRecording]);

  // Stop if blobUrl is cleared
  useEffect(() => {
    if (!blobUrl) {
      handleStopRecording();
    }
  }, [blobUrl]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    isCancelledRef.current = false;

    mediaRecorder.ondataavailable = (event) => {
      if (isCancelledRef.current) return;

      chunksRef.current.push(event.data);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    };

    mediaRecorder.start(1000); // emit chunks every second
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    isCancelledRef.current = true;
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    // ✅ Stop mic to remove red dot
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // setIsRecording(false);
    // setIsStopRecording(false);
  };

  const handleCancelRecording = () => {
    isCancelledRef.current = true;
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    chunksRef.current = [];
    setIsRecording(false);
    setIsStopRecording(false);
    setBlobUrl(null);
  };

  return (
    <div>
      <div>
        {isRecording ? (
          <Button
            isIconOnly
            variant="light"
            radius="full"
            size="md"
            onClick={handleCancelRecording}
          >
            <MdCancel size={24} />
          </Button>
        ) : (
          <Button
            isIconOnly
            variant="light"
            radius="full"
            size="md"
            onClick={handleStartRecording}
          >
            <MdSettingsVoice size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
