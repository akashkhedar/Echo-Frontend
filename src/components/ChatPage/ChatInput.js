import { Send } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { useState } from "react";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import useUser from "../../hooks/useUser";
import socket from "../../utils/socket";

const ChatInput = () => {
  const { conversation } = useSelectedChatUser();
  const { data: user } = useUser();

  const [inputMessage, setInputMessage] = useState("");
  const wordLimit = 250;

  const handleChange = (event) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      setInputMessage(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();

    try {
      const trimmedMessage = inputMessage.trim().replace(/\s+/g, " ");

      if (trimmedMessage) {
        socket.emit("sendMessage", {
          senderId: user._id,
          receiverId: conversation?.user._id,
          message: inputMessage,
          username: user.username,
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
        height: "2.2rem",
        display: "flex",
        alignItems: "center",
        backgroundColor: "black",
        color: "whitesmoke",
        padding: 1,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        position: "sticky",
        bottom: 0,
        zIndex: 2,
      }}
    >
      <InputBase
        color={inputMessage.split(/\s+/).length > wordLimit ? "red" : "gray"}
        minRows={1}
        maxRows={3}
        placeholder="Type a message"
        value={inputMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          flexGrow: 1,
          marginRight: 8,
          padding: 10,
          resize: "none",
          border: "none",
          outline: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "whitesmoke",
          maxHeight: "6.5rem", // ~3 rows height
          overflowY: "auto",
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
