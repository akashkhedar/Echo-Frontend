import { Box, styled } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import NewMessage from "./NewMessage";
import QuickChat from "../../assets/QuickChat.jpg";
import { useLocation } from "react-router-dom";
import LoadingChats from "./LoadingChats";
import useChatMessages from "../../hooks/useChatMessages";

const MessageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "4px",
});

const StyledBox = styled(Box)({
  padding: "12px",
  height: "100%",
  overflowY: "auto",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },
});

const Messages = () => {
  const outerDiv = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const path = useLocation();

  const userId = useSelector((state) => state.user.userId);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);

  const { data: messages = [], isLoading } = useChatMessages(currentOpenedChat);

  useEffect(() => {
    if (path.pathname === "/" && outerDiv.current) {
      outerDiv.current.style.background = `url(${QuickChat}) no-repeat center center/cover`;
    }
  }, [path]);

  useLayoutEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isLoading]);

  return (
    <div
      style={{ position: "relative", height: "100%", overflow: "hidden" }}
      ref={outerDiv}
    >
      <StyledBox ref={scrollContainerRef}>
        <MessageContainer>
          {isLoading ? (
            <LoadingChats />
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <Message msg={msg} userId={userId} key={msg._id} />
              ))}
              <div ref={messagesEndRef} style={{ height: 1 }} />
            </>
          ) : (
            <NewMessage />
          )}
        </MessageContainer>
      </StyledBox>
    </div>
  );
};

export default Messages;
