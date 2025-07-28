import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
  const isUserAtBottom = useRef(true);
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(chats);
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance(`/chat/fetch/msg/${currentOpenedChat}`);
        console.log(res.data);
        dispatch(setChat(res.data));
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [chats, currentOpenedChat, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (outerDiv.current && innerDiv.current) {
        outerDiv.current.scrollTo({
          top: innerDiv.current.scrollHeight,
          left: 0,
          behavior: "auto",
        });
        isUserAtBottom.current = true;
      }
    }, 0);
  }, [currentOpenedChat]);

  useEffect(() => {
    if (!outerDiv.current || !innerDiv.current) return;

    const outerDivHeight = outerDiv.current.clientHeight;
    const innerDivHeight = innerDiv.current.scrollHeight;
    const outerDivScrollTop = outerDiv.current.scrollTop;

    const nearBottom =
      outerDivScrollTop >= innerDivHeight - outerDivHeight - 100;

    isUserAtBottom.current = nearBottom;

    if (nearBottom) {
      outerDiv.current.scrollTo({
        top: innerDivHeight - outerDivHeight + 30,
        left: 0,
        behavior: "smooth",
      });
    } else {
    }
  }, [chats]);

  useEffect(() => {
    const handleScroll = () => {
      if (!outerDiv.current || !innerDiv.current) return;

      const outerDivHeight = outerDiv.current.clientHeight;
      const innerDivHeight = innerDiv.current.scrollHeight;
      const outerDivScrollTop = outerDiv.current.scrollTop;

      const nearBottom =
        outerDivScrollTop >= innerDivHeight - outerDivHeight - 100;

      isUserAtBottom.current = nearBottom;
    };

    const scrollBox = outerDiv.current;
    scrollBox?.addEventListener("scroll", handleScroll);
    return () => scrollBox?.removeEventListener("scroll", handleScroll);
  }, []);

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
        </MessageContainer>
      </StyledBox>
    </div>
  );
};

export default MessageSection;
