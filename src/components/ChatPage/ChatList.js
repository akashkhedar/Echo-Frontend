import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, IconButton, List, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import {
  setChat,
  setChatId,
  setChatName,
  setChatProfileImage,
  setChatUserId,
  setChatUserName,
} from "../../redux/slices/ChatSlice/ChatSlice";
import ConversationsList from "./ConversationsList";
import ListSearch from "./ListSearch";

const ChatList = () => {
  const conversations = useSelector((state) => state.convo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChat = useSelector((state) => state.chat.chatId);

  const handleClick = async (convo) => {
    try {
      dispatch(setChatId(convo._id));
      dispatch(setChatUserId(convo.user._id));
      dispatch(setChatName(convo.user.fullname));
      dispatch(setChatUserName(convo.user.username));
      dispatch(setChatProfileImage(convo.user.profileImage));
      const res = await axiosInstance(`/fetch/chats/${convo._id}`);
      dispatch(setChat(res.data));
    } catch (error) {
      console.log(error);
    }
  };

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
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <List>
          {conversations.map((conversation) => (
            <ConversationsList
              conversation={conversation}
              selectedChat={selectedChat}
              handleClick={handleClick}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
