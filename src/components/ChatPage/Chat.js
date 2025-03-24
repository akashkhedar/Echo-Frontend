import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import axiosInstance from "../../axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
const io = require("socket.io-client");

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearChat());
      try {
        const res = await axiosInstance.get("/chat/list");
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    socket.emit("joinChat", userId);
    socket.on("joinedChat", (data) => {
      console.log(data);
    });
    socket.on("leftChat", (data) => {
      console.log(data);
    });

    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#1e1e1f",
        height: "90.8vh",
      }}
    >
      {/* Sidebar */}
      <ChatList conversations={conversations} />
      {/* Chat Window */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "auto",
        }}
      >
        {/* Chat Header */}
        {selectedChat ? selectedChat.length > 0 ? <ChatHeader /> : null : null}
        {/* Chat Messages */}
        <ChatSection />
        {/* Message Input */}
        {selectedChat ? selectedChat.length > 0 ? <ChatInput /> : null : null}
      </Box>
    </Box>
  );
};

export default ChatPage;
