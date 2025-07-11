import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBG from "../../assets/ChatBG.jpeg";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";

const ChatPage = () => {
  const selectedChat = useSelector((state) => state.chat.chatId);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearChat());
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        background: `url(${ChatBG}) no-repeat center center/cover`,
        backgroundSize: "cover",
        height: "90.8vh",
      }}
    >
      <ChatList />
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
        {selectedChat === null ? null : <ChatHeader />}
        <ChatSection />
        {selectedChat === null ? null : <ChatInput />}
      </Box>
    </Box>
  );
};

export default ChatPage;
