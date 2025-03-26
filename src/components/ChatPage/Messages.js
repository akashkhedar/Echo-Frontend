import { Box, styled } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import socket from "../../utils/socket";
import { setChat } from "../../redux/slices/ChatSlice/ChatSlice";
import { useDispatch } from "react-redux";

const StyledBox = styled(Box)({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
});

const MessageSection = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);
  useEffect(() => {
    const receiveMessageHandler = (msg) => {
      dispatch(setChat(msg));
    };

    socket.on("receiveMsg", (msg) => receiveMessageHandler(msg));

    return () => {
      socket.off("receiveMsg", receiveMessageHandler); // Cleanup on unmount
    };
  }, [dispatch, chats]);

  return (
    <StyledBox>
      {chats.length > 0
        ? chats.map((msg) => (
            <Message msg={msg} userId={userId} key={msg._id} />
          ))
        : null}
    </StyledBox>
  );
};

export default MessageSection;
