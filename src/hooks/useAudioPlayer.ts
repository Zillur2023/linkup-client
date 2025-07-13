import { useState, useRef, useEffect } from "react";

export const useAudioPlayer = (blobUrl: string | null, maxDuration: number) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentPlayTime, setCurrentPlayTime] = useState(maxDuration);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  const clearPlaybackInterval = () => {
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
      playbackInterval.current = null;
    }
  };

  const handlePlaybackEnd = () => {
    setIsPlaying(false);
    setIsPause(false);
    setCurrentPlayTime(maxDuration);
    setPlaybackProgress(100);
    clearPlaybackInterval();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      clearPlaybackInterval();
    } else {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
        setPlaybackProgress(0);
      }
      audioRef.current
        .play()
        .then(() => startPlaybackTimer())
        .catch((error) => console.error("Playback failed:", error));
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) setIsPause(true);
  };

  const startPlaybackTimer = () => {
    clearPlaybackInterval();

    playbackInterval.current = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        setCurrentPlayTime(Math.max(0, Math.floor(maxDuration - currentTime)));
        const progress =
          maxDuration > 0 ? (currentTime / maxDuration) * 100 : 0;
        setPlaybackProgress(progress);

        if (audioRef.current.ended) {
          handlePlaybackEnd();
        }
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearPlaybackInterval();
    };
  }, []);

  useEffect(() => {
    if (!blobUrl) {
      setIsPlaying(false);
      setIsPause(false);
      setPlaybackProgress(0);
      setCurrentPlayTime(maxDuration);
      // setCurrentPlayTime(0);
      clearPlaybackInterval();
    }
  }, [blobUrl, maxDuration]);

  return {
    audioRef,
    isPlaying,
    isPause,
    playbackProgress,
    currentPlayTime,
    togglePlay,
    handlePlaybackEnd,
  };
};
