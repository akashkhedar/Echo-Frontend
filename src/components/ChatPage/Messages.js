import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markMessageRead } from "../../redux/slices/ChatSlice/ChatSlice";
import socket from "../../utils/socket";
import Message from "./Message";
import NewMessage from "./NewMessage";
import QuickChat from "../../assets/QuickChat.jpg";
import { useLocation } from "react-router-dom";

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
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
    flexGrow: 1,
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
  });

  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (outerDiv.current && innerDiv.current) {
        outerDiv.current.scrollTo({
          top: innerDiv.current.scrollHeight,
          left: 0,
          behavior: "auto",
        });
        isUserAtBottom.current = true;
        setShowScrollButton(false);
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
      setShowScrollButton(false);
      outerDiv.current.scrollTo({
        top: innerDivHeight - outerDivHeight + 30,
        left: 0,
        behavior: "smooth",
      });
    } else {
      setShowScrollButton(true);
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

      if (nearBottom) setShowScrollButton(false);
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

  const handleScrollToBottom = () => {
    if (outerDiv.current && innerDiv.current) {
      outerDiv.current.scrollTo({
        top: innerDiv.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
      setShowScrollButton(false);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <StyledBox ref={outerDiv}>
        <MessageContainer ref={innerDiv}>
          {chats.length > 0 ? (
            chats.map((msg) => (
              <Message msg={msg} userId={userId} key={msg._id} />
            ))
          ) : (
            <NewMessage />
          )}
        </MessageContainer>
      </StyledBox>

      {showScrollButton && (
        <Box
          onClick={handleScrollToBottom}
          sx={{
            position: "absolute",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#2e2e48",
            color: "white",
            px: 2,
            py: 1,
            borderRadius: 5,
            boxShadow: 3,
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.3s ease-in-out",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "#3b3b59",
            },
          }}
        >
          New Message
        </Box>
      )}
    </div>
  );
};

export default MessageSection;
