import { Box, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectConversations } from "../../redux/selectors/unreadSelector";
import {
  setUserOffline,
  setUserOnline,
} from "../../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../../utils/socket";
import ChatListLoading from "./ChatListLoading";
import ConversationsList from "./ConversationsList";
import EmptyChatList from "./EmptyChatList";
import ListSearch from "./ListSearch";

const ChatList = () => {
  const conversations = useSelector(selectConversations);
  const selectedChat = useSelector((state) => state.chat.chatId);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("userOnline", (userId) => dispatch(setUserOnline(userId)));
    socket.on("userOffline", (userId) => dispatch(setUserOffline(userId)));

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [dispatch]);

  useEffect(() => {
    // Simulate loading delay — replace with real loading logic
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "30%", md: "25%" }, // Full width on small screens
        height: { xs: "40vh", sm: "auto" },
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
