import {
  Box,
  Card,
  CardContent,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";

const ChatBubble = styled(Card)(({ align }) => ({
  maxWidth: "60%",
  display: "inline-flex",
  alignSelf: align === "right" ? "flex-end" : "flex-start",
  backgroundColor: align === "right" ? "rgb(43, 9, 48)" : "rgb(11, 9, 48)",
  color: "rgb(199, 192, 192)",
  wordWrap: "break-word",
  borderRadius: "12px",
  paddingTop: 0.5,
  border: "1px solid",
  borderColor: align === "right" ? "rgb(142, 64, 195)" : "rgb(77, 64, 195)",
  marginBottom: 1.5,
  textAlign: align === "right" ? "left" : "right",
  justifyContent: align === "right" ? "flex-start" : "flex-end",
}));

const formatTime = (timestamp) => {
  if (!timestamp) return "N/A"; // Prevent error when timestamp is undefined
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const Message = ({ msg, userId }) => {
  const isSent = msg.sender === userId;

  return (
    <ChatBubble align={isSent ? "right" : "left"}>
      <CardContent
        sx={{
          padding: "6px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          marginBottom: -2,
        }}
      >
        {/* Ensure message is always a string */}
        <Typography>
          {typeof msg.message === "string"
            ? msg.message
            : JSON.stringify(msg.message)}
        </Typography>

        {/* Timestamp alignment */}
        <Box
          sx={{
            display: "flex",
            justifyContent: isSent ? "flex-end" : "flex-start",
            alignItems: "center",
            textAlign: isSent ? "right" : "left",
            my: isSent ? -1 : null,
          }}
        >
          <Typography variant="caption" color="gray" fontSize={10}>
            {formatTime(msg.createdAt)}
          </Typography>
          {isSent ? (
            <IconButton>
              <DoneIcon sx={{ fontSize: 12 }} color="success" />
            </IconButton>
          ) : null}
        </Box>
      </CardContent>
    </ChatBubble>
  );
};

export default Message;
