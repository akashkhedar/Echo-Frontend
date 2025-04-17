import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import socket from "../../utils/socket";
import NewMessage from "./NewMessage";
import {
  setChat,
  markMessageRead,
} from "../../redux/slices/ChatSlice/ChatSlice";
import { Flip, ToastContainer, toast } from "react-toastify";
import { markConversationUnread } from "../../redux/slices/ConversationSlice/ConversationSlice";

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

const MessageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const MessageSection = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);

  const outerDiv = useRef(null);
  const innerDiv = useRef(null);
  const isUserAtBottom = useRef(true);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const notify = (sender) => toast(`Message from ${sender}`);

  // 📦 Scroll to bottom when component first mounts (like WhatsApp)
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
    }, 0); // Ensure DOM is ready
  }, [currentOpenedChat]);

  useEffect(() => {
    socket.on("receiveMsg", (message, username) => {
      if (message.conversationId === currentOpenedChat) {
        dispatch(setChat([...chats, message]));
        return;
      }
      if (
        message.conversationId !== currentOpenedChat &&
        message.sender !== userId
      ) {
        dispatch(markConversationUnread(message.conversationId));
        notify(username);
      }
    });

    socket.on("notify", (sender) => {
      notify(sender);
    });

    return () => {
      socket.off("receiveMsg");
    };
  });

  // 📦 Scroll on new message if at bottom
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

  // 📦 Track scroll to toggle "new message" button
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

        <ToastContainer
          position="bottom-left"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          transition={Flip}
        />
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
