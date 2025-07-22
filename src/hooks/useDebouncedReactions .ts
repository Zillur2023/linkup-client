import { useSocketContext } from "@/context/socketContext";
import { store } from "@/redux/store";
import { useEffect, useRef } from "react";

// 1. Create a debounce hook (reusable)
export const useDebouncedReactions = () => {
  const { socket } = useSocketContext();
  const timers = useRef<Record<string, NodeJS.Timeout>>({});

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  const triggerDebouncedEmit = (postId: string) => {
    // Clear any existing timer for this post
    if (timers.current[postId]) {
      clearTimeout(timers.current[postId]);
    }

    // Set new 3-second timer
    timers.current[postId] = setTimeout(() => {
      const { likes, dislikes } = store.getState().reactions;
      socket?.emit("update-like-dislike", {
        postId,
        likes: likes[postId] || [],
        dislikes: dislikes[postId] || [],
      });

      // Clean up
      delete timers.current[postId];
    }, 3000); // 3 second debounce
  };

  return { triggerDebouncedEmit };
};
