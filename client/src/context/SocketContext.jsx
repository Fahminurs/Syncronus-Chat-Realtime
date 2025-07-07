import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Membuat konteks untuk socket
const SocketContext = createContext(null);

// Hook untuk menggunakan konteks socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// Provider untuk mengelola koneksi socket
export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo, addMessage, setTypingStatus } = useAppStore();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id || 
           selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("typing", (data) => {
        setTypingStatus(data); // Menerima status mengetik dari server
      });

      // Memutuskan koneksi saat komponen unmount
      return () => {
        socket.current.disconnect();
      };
    } else {
      console.warn("User info or user ID is missing.");
    }
  }, [userInfo]);

  const sendTypingStatus = (typing) => {
    if (socket.current) {
      socket.current.emit("typing", { userId: userInfo.id, typing });
    }
  };

  const sendMessage = (messageData) => {
    if (socket.current) {
      socket.current.emit("sendMessage", messageData);
    }
  }

  return (
    <SocketContext.Provider value={{ socket: socket.current, sendTypingStatus, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};