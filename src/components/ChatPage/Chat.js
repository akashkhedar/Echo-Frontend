import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
import { useDispatch } from "react-redux";

const ChatPage = () => {
  const selectedChat = useSelector((state) => state.chat.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearChat());
    return () => {
      dispatch(clearChat());
    };
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#1e1e1f",
        height: "90.8vh",
      }}
    >
      {/* Sidebar */}
      <ChatList />
      {/* Chat Window */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "auto",
        }}
      >
        {/* Chat Header */}
        {selectedChat ? selectedChat.length > 0 ? <ChatHeader /> : null : null}
        {/* Chat Messages */}
        <ChatSection />
        {/* Message Input */}
        {selectedChat ? selectedChat.length > 0 ? <ChatInput /> : null : null}
      </Box>
    </Box>
  );
};

export default ChatPage;
