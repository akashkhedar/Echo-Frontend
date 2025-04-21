import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, IconButton, List, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import {
  setChat,
  setChatId,
  setRoomId,
  setChatUserId,
} from "../../redux/slices/ChatSlice/ChatSlice";
import ConversationsList from "./ConversationsList";
import ListSearch from "./ListSearch";
import {
  markConversationRead,
  setUserOffline,
  setUserOnline,
} from "../../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../../utils/socket";
import EmptyChatList from "./EmptyChatList";

const ChatList = () => {
  const conversations = useSelector((state) => state.convo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChat = useSelector((state) => state.chat.chatId);
  const { _id } = useSelector((state) => state.user);

  const handleClick = async (convo) => {
    try {
      socket.emit("rmOfflineMsg", _id, convo._id);
      dispatch(markConversationRead(convo._id));
      dispatch(setChatId(convo._id));
      dispatch(setRoomId(convo.roomId));
      dispatch(setChatUserId(convo.user._id));
      const res = await axiosInstance(`/fetch/chats/${convo._id}`);
      dispatch(setChat(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("userOnline", (userId) => {
      dispatch(setUserOnline(userId)); // Update Redux/chatList
    });

    socket.on("userOffline", (userId) => {
      dispatch(setUserOffline(userId)); // Update Redux/chatList
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
        height: "calc(100vh - 4rem)", // Full height for proper scrolling
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
          alignItems: "center",
          justifyContent: "center",
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
                handleClick={handleClick}
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
