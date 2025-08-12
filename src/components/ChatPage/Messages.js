import { Box, styled } from "@mui/material";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QuickChat from "../../assets/QuickChat.jpg";
import useChatMessages from "../../hooks/useChatMessages";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import useUser from "../../hooks/useUser";
import LoadingChats from "./LoadingChats";
import Message from "./Message";
import NewMessage from "./NewMessage";

const MessageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "4px",
  paddingTop: "8px", // space for first message
  paddingBottom: "8px", // space for last message
});

const StyledBox = styled(Box)({
  padding: "12px",
  height: "100%",
  overflowY: "auto",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",

  // Hide scrollbar in WebKit browsers (Chrome, Safari)
  "&::-webkit-scrollbar": {
    display: "none",
  },

  // Hide scrollbar in Firefox
  scrollbarWidth: "none",

  // Hide scrollbar in IE/Edge
  msOverflowStyle: "none",
});

const Messages = () => {
  const outerDiv = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const path = useLocation();

  const { data: user } = useUser();

  const { conversation } = useSelectedChatUser();

  const { data: messages = [], isLoading } = useChatMessages(conversation?._id);

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
                <Message msg={msg} userId={user._id} key={msg._id} />
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
