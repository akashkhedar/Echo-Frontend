import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  Box,
  createTheme,
  IconButton,
  List,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useConversationList from "../../hooks/useConversationList";
import socket from "../../utils/socket";
import ChatListLoading from "./ChatListLoading";
import ConversationsList from "./ConversationsList";
import EmptyChatList from "./EmptyChatList";
import ListSearch from "./ListSearch";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 900,
    },
  },
});

const ChatList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.user);
  const { data: conversations } = useConversationList(userId);
  const selectedChat = useSelector((state) => state.chat.chatId);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const listWidth = isMobile ? "100%" : isTablet ? "30%" : "25%";

  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    socket.on("userOnline", (id) => {
      console.log(id);
      queryClient.setQueryData(["conversations", userId], (old) =>
        old?.map((convo) =>
          convo.user._id === id
            ? { ...convo, user: { ...convo.user, isOnline: true } }
            : convo
        )
      );
    });

    socket.on("userOffline", (id) => {
      queryClient.setQueryData(["conversations", userId], (old) =>
        old?.map((convo) =>
          convo.user._id === id
            ? { ...convo, user: { ...convo.user, isOnline: false } }
            : convo
        )
      );
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [queryClient, userId]);

  useEffect(() => {
    // Simulate loading delay — replace with real loading logic
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        width: listWidth,
        borderRight: { sm: "2px solid rgb(51, 51, 71)" },
        backgroundColor: "#1E1E2F",
        display: "flex",
        flexDirection: "column",
        color: "whitesmoke",
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
        {isMobile && (
          <IconButton onClick={handleBack}>
            <ArrowBackIosRoundedIcon sx={{ color: "white", mr: 3, ml: -0.5 }} />
          </IconButton>
        )}
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
          "&::-webkit-scrollbar": { display: "none" },
          "scrollbar-width": "none",
          msOverflowStyle: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            !loading && (!conversations || conversations.length === 0)
              ? "center"
              : "flex-start",
          alignItems:
            !loading && (!conversations || conversations.length === 0)
              ? "center"
              : "stretch",
        }}
      >
        <List
          disablePadding
          sx={{
            width: "100%",
          }}
        >
          {loading ? (
            <ChatListLoading />
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationsList
                key={conversation._id}
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
