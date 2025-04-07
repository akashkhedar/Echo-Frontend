import { Box, styled } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import EmptyChat from "./EmptyChat";
import Messages from "./Messages";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  color: "whitesmoke",
  flexGrow: 1,
  overflowY: "auto",
  height: "100%",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
  "-ms-overflow-style": "none",
}));

const ChatSection = () => {
  const chatId = useSelector((state) => state.chat.chatId);

  return <StyledBox>{!chatId ? <EmptyChat /> : <Messages />}</StyledBox>;
};

export default ChatSection;
