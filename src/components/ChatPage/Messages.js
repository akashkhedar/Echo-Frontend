import { Box, styled } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const Messages = () => {
  const outerDiv = useRef(null);
  const scrollRef = useRef(null);
  const path = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  const userId = useSelector((state) => state.user.userId);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatMessages(currentOpenedChat);

  useEffect(() => {
    if (path.pathname === "/" && outerDiv.current) {
      outerDiv.current.style.background = `url(${QuickChat}) no-repeat center center/cover`;
    }
  }, [path]);

  // Scroll to bottom only for initial load
  useLayoutEffect(() => {
    if (scrollRef.current && initialLoad && data?.pages?.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
      setInitialLoad(false);
    }
  }, [data, initialLoad]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const messages = data?.pages?.flat() || [];

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <StyledBox ref={outerDiv} onScroll={handleScroll}>
        <MessageContainer>
          {isLoading ? (
            <LoadingChats />
          ) : messages.length > 0 ? (
            messages.map((msg) => (
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

export default Messages;
