import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatBG from "../../assets/ChatBG.jpeg";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";

const ChatPage = () => {
  const { conversation, clearConversation } = useSelectedChatUser();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const isTablet = useMediaQuery("(min-width:750px)");

  useEffect(() => {
    // This will run when component unmounts or location changes
    return () => {
      // Only clear if we're actually leaving the chat page
      if (!location.pathname.includes("/chat")) {
        clearConversation();
      }
    };
  }, [location.pathname, clearConversation]);

  return (
    <Box
      sx={{
        display: "flex",
        background: `url(${ChatBG}) no-repeat center center/cover`,
        backgroundSize: "cover",
        borderTopLeftRadius: 8,
        borderTop: "1.5px solid #1f1f1fff",
        borderLeft: "1.5px solid #1f1f1fff",
        height: isMobile ? "calc(100vh - 56px - 4rem)" : "100%",
        width: "100%",
        overflow: "hidden",
        mt: 0.2,
      }}
    >
      {/* Sidebar (Chat List) */}
      {isTablet || (!isTablet && !conversation?.["_id"]) ? <ChatList /> : null}

      {(isTablet && conversation?.["_id"]) ||
      (!isTablet && conversation?.["_id"]) ? (
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
          {conversation?.["_id"] && (
            <Box
              sx={{
                position: "static",
                top: 0,
                zIndex: 10,
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
          {conversation?.["_id"] && <ChatInput />}
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatPage;
