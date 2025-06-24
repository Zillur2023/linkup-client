"use client";

import { Card } from "@heroui/react";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Dynamic import for client-only emoji picker
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPickerButton = ({ onEmojiSelect }: EmojiPickerButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    onEmojiSelect(emojiData.emoji);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible((prev) => !prev);
  };

  // Close when clicking outside of the popupRef
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative">
      <button
        className=""
        onClick={toggleEmojiPicker}
        // aria-label="Open emoji picker"
      >
        <BsFillEmojiSmileFill className="text-lg text-default-600" />
      </button>

      {isVisible && (
        <div className="fixed inset-0 z-40">
          <div ref={popupRef} className="absolute right-0 bottom-12 z-50">
            <Card className="shadow-lg rounded-lg overflow-hidden border border-default-200 bg-white dark:bg-default-800">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={320}
                height={350}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
