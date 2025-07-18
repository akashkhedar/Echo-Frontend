import React, { useState } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { AttachFile, Send } from "@mui/icons-material";
import { useSelector } from "react-redux";
import socket from "../../utils/socket";
import { useLocation } from "react-router-dom";

const ChatInput = () => {
  const path = useLocation();

  const selectedUser = useSelector((state) => state.chat.chatUserId);
  const userId = useSelector((state) => state.user._id);
  const username = useSelector((state) => state.user.username);

  const [inputMessage, setInputMessage] = useState("");
  const wordLimit = 250;

  const handleChange = (event) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      setInputMessage(text);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();

    try {
      const trimmedMessage = inputMessage.trim().replace(/\s+/g, " ");

      if (trimmedMessage) {
        socket.emit("sendMessage", {
          senderId: userId,
          receiverId: selectedUser,
          message: inputMessage,
          username: username,
        });
        setInputMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <Box
      sx={{
        padding: 1,
        height: "2.2rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#2E2E48",
        color: "whitesmoke",
      }}
    >
      {path === "/chat" ? null : (
        <IconButton
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              backgroundColor: "#1e1e1f",
              borderRadius: 2,
              padding: 1,
            },
          }}
        >
          <AttachFile sx={{ fontSize: 25 }} />
        </IconButton>
      )}
      <InputBase
        placeholder="Type a message"
        multiline
        value={inputMessage}
        onChange={handleChange}
        color={inputMessage.split(/\s+/).length > wordLimit ? "red" : "gray"}
        sx={{
          flexGrow: 1,
          marginLeft: 1,
          marginRight: 1,
          padding: 1,
          backgroundColor: "rgb(22, 21, 21)",
          borderRadius: 2,
          color: "whitesmoke",
        }}
      />
      <IconButton
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          background: "rgb(184, 44, 212)",
          padding: 1,
          borderRadius: 1,
          "&:hover": {
            background: "rgb(197, 41, 228)",
          },
        }}
        onClick={handleSend}
      >
        <Send sx={{ fontSize: 26, color: "white" }} />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
