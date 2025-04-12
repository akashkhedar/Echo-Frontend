import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import socket from "../../utils/socket";
import NewMessage from "./NewMessage";
import {
  setChat,
  markMessageRead,
} from "../../redux/slices/ChatSlice/ChatSlice";
import { Flip, ToastContainer, toast } from "react-toastify";

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

  const outerDiv = useRef(null);
  const innerDiv = useRef(null);
  const prevInnerDivHeight = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const notify = (sender) => toast(`Message from ${sender}`);

  useEffect(() => {
    const handleReceiveMsg = ({ msg, sender }) => {
      dispatch(setChat([...chats, msg]));
      notify(sender);
    };

    socket.on("receiveMsg", handleReceiveMsg);

    return () => {
      socket.off("receiveMsg", handleReceiveMsg);
    };
  }, [dispatch, chats]);

  useEffect(() => {
    if (!outerDiv.current || !innerDiv.current) return;

    const outerDivHeight = outerDiv.current.clientHeight;
    const innerDivHeight = innerDiv.current.scrollHeight;
    const outerDivScrollTop = outerDiv.current.scrollTop;

    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop >= prevInnerDivHeight.current - outerDivHeight - 20
    ) {
      outerDiv.current.scrollTo({
        top: innerDivHeight - outerDivHeight + 30, // Increased padding
        left: 0,
        behavior: prevInnerDivHeight.current ? "smooth" : "auto",
      });
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }

    prevInnerDivHeight.current = innerDivHeight;
  }, [chats]);

  const handleScrollButtonClick = useCallback(() => {
    if (!outerDiv.current || !innerDiv.current) return;
    const outerDivHeight = outerDiv.current.clientHeight;
    const innerDivHeight = innerDiv.current.scrollHeight;

    outerDiv.current.scrollTo({
      top: innerDivHeight - outerDivHeight + 40, // Ensuring last message is fully visible
      left: 0,
      behavior: "smooth",
    });

    setShowScrollButton(false);
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
        <button
          style={{
            position: "absolute",
            backgroundColor: "red",
            color: "white",
            left: "50%",
            bottom: "10px",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            opacity: 1,
          }}
          onClick={handleScrollButtonClick}
        >
          New message!
        </button>
      )}
    </div>
  );
};

export default MessageSection;
