import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
import { useDispatch } from "react-redux";
import ChatBG from "../../assets/ChatBG.jpeg";

const ChatPage = () => {
  const selectedChat = useSelector((state) => state.chat.chatId);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearChat());
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        // backgroundColor: "#1e1e1f",
        background: `url(${ChatBG}) no-repeat center center/cover`,
        backgroundSize: "cover",
        height: "90.8vh",
      }}
    >
      <ChatList />
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
        {selectedChat === null ? null : <ChatHeader />}
        <ChatSection />
        {selectedChat === null ? null : <ChatInput />}
      </Box>
    </Box>
  );
};

export default ChatPage;
