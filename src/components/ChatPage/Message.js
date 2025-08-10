import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Card, Typography, styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import socket from "../../utils/socket";

const BubbleWrapper = styled(Box)(({ align }) => ({
  display: "flex",
  justifyContent: align === "right" ? "flex-end" : "flex-start",
  padding: "4px 8px",
}));

const ChatBubble = styled(Card)(({ align }) => ({
  maxWidth: "75%",
  padding: "6px 10px",
  borderRadius: "16px",
  borderTopLeftRadius: align === "right" ? "16px" : "4px",
  borderTopRightRadius: align === "right" ? "4px" : "16px",
  color: "#e0e0e0",
  wordBreak: "break-word",
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
  position: "relative",
  border: "1px solid",
  backgroundColor: align === "right" ? "rgb(43, 9, 48)" : "rgb(11, 9, 48)",
  borderColor: align === "right" ? "rgb(142, 64, 195)" : "rgb(77, 64, 195)",
}));

const Message = ({ msg, userId }) => {
  const isSent = msg.sender === userId;
  const { conversation } = useSelectedChatUser();
  const messageRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversation?._id || conversation?._id !== msg.conversationId) return;
    if (msg.sender === userId || msg.read) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!msg.read) {
            socket.emit("readMsg", {
              msgId: msg._id,
              chatId: conversation?._id,
              roomId: conversation?.roomId,
              senderId: msg.sender,
            });

            queryClient.setQueryData(
              ["chatMessages", conversation?._id],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  pages: old.pages.map((page) =>
                    page.map((m) =>
                      m._id === msg._id ? { ...m, read: true } : m
                    )
                  ),
                };
              }
            );
          }
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (messageRef.current) observer.observe(messageRef.current);
    return () => observer.disconnect();
  }, [msg, userId, conversation.roomId, conversation._id, queryClient]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getTickIcon = () => {
    if (msg.read)
      return <DoneAllIcon sx={{ fontSize: 12, color: "#4fc3f7", ml: 0.5 }} />;
    if (msg.delivered)
      return <DoneAllIcon sx={{ fontSize: 12, color: "grey", ml: 0.5 }} />;
    if (msg.sent)
      return <DoneIcon sx={{ fontSize: 12, color: "grey", ml: 0.5 }} />;
    return <ScheduleIcon sx={{ fontSize: 12, color: "grey", ml: 0.5 }} />;
  };

  return (
    <BubbleWrapper align={isSent ? "right" : "left"} ref={messageRef}>
      <ChatBubble align={isSent ? "right" : "left"}>
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {typeof msg.message === "string"
            ? msg.message
            : JSON.stringify(msg.message)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "2px",
            marginTop: "4px",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 10, color: "gray" }}>
            {formatTime(msg.createdAt)}
          </Typography>
          {isSent && getTickIcon()}
        </Box>
      </ChatBubble>
    </BubbleWrapper>
  );
};

export default Message;
