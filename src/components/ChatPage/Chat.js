import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBG from "../../assets/ChatBG.jpeg";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";

const ChatPage = () => {
  const currentOpenedChat = useSelector((state) => state.chat.chatId);
  const selectedChat = useSelector((state) => state.chat.chatId);
  const dispatch = useDispatch();
  const isTablet = useMediaQuery("(min-width:750px)");

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
        height: "90.8vh", // adjust if your navbar takes different space
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar (Chat List) */}
      {isTablet || (!isTablet && !selectedChat) ? <ChatList /> : null}

      {/* Chat Area */}
      {(isTablet && selectedChat) || (!isTablet && currentOpenedChat) ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Sticky Chat Header */}
          {selectedChat !== null && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#1e1e2f", // or same as modal/bg color
              }}
            >
              <ChatHeader />
            </Box>
          )}

          {/* Scrollable Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            <ChatSection />
          </Box>

          {/* Chat Input at Bottom */}
          {selectedChat !== null && <ChatInput />}
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatPage;
