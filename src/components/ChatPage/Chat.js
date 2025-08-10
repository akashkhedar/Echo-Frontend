import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import ChatBG from "../../assets/ChatBG.jpeg";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";

const ChatPage = () => {
  const { conversation, clearConversation } = useSelectedChatUser();
  const isTablet = useMediaQuery("(min-width:750px)");

  useEffect(() => {
    return () => {
      clearConversation();
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
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#1e1e2f",
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
