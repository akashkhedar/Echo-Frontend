import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, IconButton, List, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setUserOffline,
  setUserOnline,
} from "../../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../../utils/socket";
import ConversationsList from "./ConversationsList";
import EmptyChatList from "./EmptyChatList";
import ListSearch from "./ListSearch";

const ChatList = () => {
  const conversations = useSelector((state) => state.convo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChat = useSelector((state) => state.chat.chatId);
  useEffect(() => {
    socket.on("userOnline", (userId) => {
      dispatch(setUserOnline(userId));
    });

    socket.on("userOffline", (userId) => {
      dispatch(setUserOffline(userId));
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  });

  return (
    <Box
      sx={{
        width: "25%",
        height: "calc(100vh - 4rem)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1E1E2F",
        color: "whitesmoke",
        borderRight: "2px solid rgb(51, 51, 71)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: 1,
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backgroundColor: "#1E1E2F",
          zIndex: 1,
        }}
      >
        <IconButton
          onClick={() => {
            navigate("/");
          }}
          sx={{
            "&:hover": {
              background: " #1e1e1f",
            },
          }}
        >
          <KeyboardBackspaceIcon sx={{ color: "whitesmoke" }} />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" ml={1}>
          Chats
        </Typography>
      </Box>

      {/* Search */}
      <ListSearch />

      {/* Chat List */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <List>
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationsList
                conversation={conversation}
                selectedChat={selectedChat}
              />
            ))
          ) : (
            <EmptyChatList />
          )}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
