import { FaPauseCircle, FaPlayCircle, FaStopCircle } from "react-icons/fa";

interface AudioPlayerControlsProps {
  isStopRecording: boolean;
  isPlaying: boolean;
  blobUrl: string | null;
  //   audioRef: React.RefObject<HTMLAudioElement>;
  audioRef: any;
  togglePlay: () => void;
  setIsStopRecording: any;
  handlePlaybackEnd: () => void;
  className?: string;
}

export const AudioPlayerControls = ({
  isStopRecording,
  isPlaying,
  blobUrl,
  audioRef,
  togglePlay,
  setIsStopRecording,
  handlePlaybackEnd,
}: AudioPlayerControlsProps) => {
  return (
    <>
      <audio
        ref={audioRef}
        src={blobUrl as string}
        onEnded={handlePlaybackEnd}
      />
      {isStopRecording ? (
        <button
          // onClick={togglePlay}
          onClick={(e) => {
            e.preventDefault();
            togglePlay();
          }}
          className="rounded-full text-white z-40"
        >
          {isPlaying ? <FaPauseCircle size={24} /> : <FaPlayCircle size={24} />}
        </button>
      ) : (
        <button
          // onClick={() => setIsStopRecording(true)}
          onClick={(e) => {
            e.preventDefault();
            setIsStopRecording(true);
          }}
          className="rounded-full text-white z-40"
        >
          <FaStopCircle size={24} />
        </button>
      )}
    </>
  );
};
