import { Box, styled } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ChatBG from "../../assets/ChatBG.jpeg";
import EmptyChat from "./EmptyChat";
import Messages from "./Messages";
import NewChat from "./NewChat";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: `url(${ChatBG}) no-repeat center center/cover`,
  backgroundSize: "cover",
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
  const chats = useSelector((state) => state.chat.chat);
  const chatId = useSelector((state) => state.chat.chatId);

  return (
    <StyledBox>
      {chatId && chats ? (
        chatId && chats.length > 0 ? (
          <Messages />
        ) : (
          <NewChat />
        )
      ) : (
        <EmptyChat />
      )}
    </StyledBox>
  );
};

export default ChatSection;
