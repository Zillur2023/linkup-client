"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { useUser } from "./UserProvider";
import { formatLastActive } from "@/uitls/formatDate";

interface UserStatus {
  status: "online" | "idle" | "offline";
  lastActive: number;
}

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
  userStatuses: Record<string, UserStatus>;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>(
    {}
  );

  useEffect(() => {
    if (user?._id) {
      const socketInstance = io("http://localhost:5000", {
        query: { userId: user._id },
        withCredentials: true,
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socketInstance.on(
        "userStatusChanged",
        ({
          userId,
          status,
          lastActive,
        }: {
          userId: string;
          status: "online" | "idle" | "offline";
          lastActive: number;
        }) => {
          setUserStatuses((prev) => ({
            ...prev,
            [userId]: { status, lastActive },
          }));
        }
      );

      socketInstance.on("heartbeat", () => {
        socketInstance.emit("userActivity");
      });

      // Track user activity
      const handleActivity = () => socketInstance.emit("userActivity");
      const events = ["mousemove", "keydown", "scroll", "click"];

      events.forEach((event) => window.addEventListener(event, handleActivity));

      return () => {
        socketInstance.disconnect();
        events.forEach((event) =>
          window.removeEventListener(event, handleActivity)
        );
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, userStatuses }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for consuming user status
export const useUserStatus = (userId: string) => {
  const { userStatuses } = useSocketContext();
  console.log("useUserStatus userStatuses ", userStatuses);
  const status = userStatuses[userId] || {
    status: "offline" as const,
    lastActive: Date.now(),
  };

  return {
    ...status,
    formattedLastActive: formatLastActive(status.lastActive),
  };
};
