import { Box, styled } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markMessageRead,
  setChat,
} from "../../redux/slices/ChatSlice/ChatSlice";
import socket from "../../utils/socket";
import Message from "./Message";
import NewMessage from "./NewMessage";
import QuickChat from "../../assets/QuickChat.jpg";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import LoadingChats from "./LoadingChats";

const MessageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const MessageSection = () => {
  const outerDiv = useRef(null);
  const innerDiv = useRef(null);
  const path = useLocation();

  useEffect(() => {
    if (path.pathname === "/") {
      outerDiv.current.style.background = `url(${QuickChat}) no-repeat center center/cover`;
    }
  });

  const StyledBox = styled(Box)({
    padding: "12px",
    height: "100%",
    overflowY: "auto",
    flexGrow: 1,
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",

    display: "flex",
    flexDirection: "column",
    "-ms-overflow-style": "none",
  });

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const chats = useSelector((state) => state.chat.chat);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);

  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance(`/chat/fetch/msg/${currentOpenedChat}`);
        dispatch(setChat(res.data));
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentOpenedChat, dispatch]);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chats, currentOpenedChat]);

  useEffect(() => {
    const handleMessageRead = (messageId) => {
      dispatch(markMessageRead(messageId));
    };

    socket.on("receiverRead", handleMessageRead);
    return () => socket.off("receiverRead", handleMessageRead);
  }, [dispatch]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <StyledBox ref={outerDiv}>
        <MessageContainer ref={innerDiv}>
          {loading ? (
            <LoadingChats />
          ) : chats.length > 0 ? (
            chats.map((msg) => (
              <Message msg={msg} userId={userId} key={msg._id} />
            ))
          ) : (
            <NewMessage />
          )}
          <div ref={scrollRef} />
        </MessageContainer>
      </StyledBox>
    </div>
  );
};

export default MessageSection;
