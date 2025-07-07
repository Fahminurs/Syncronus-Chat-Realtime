import React from "react";
import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";
import TypingIndicator from "./components/typingindicator"; // Sesuaikan path jika perlu

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      
      {/* Menambahkan TypingIndicator di sini */}
      <TypingIndicator  />
      
<br />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;