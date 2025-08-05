import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import { IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import * as React from "react";
import { useSelector } from "react-redux";
import QuickMessages from "./QuickMessages";
import UserTabs from "./UserTabs";
import ListLoading from "./ListLoading";
import EmptyChatList from "./EmptyChatList";
import useConversationList from "../../hooks/useConversationList";

const LGQuickChat = () => {
  const userId = useSelector((state) => state.user._id);
  const { data: conversations } = useConversationList(userId);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          height: "calc(100vh - 20.5rem)",
          marginTop: "4rem",
          width: "13rem",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          borderTop: "1.5px solid #333",
          borderLeft: "1.5px solid #333",
          borderBottom: "1.5px solid #333",
          backgroundColor: "#1E1E2F",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // ✅ fixed typo from "key"
          alignItems: "center",
          padding: "0.5rem",
          gap: 1,
          justifyContent: { xs: "center", lg: "flex-start" },
        }}
      >
        <IconButton>
          <Diversity1OutlinedIcon
            sx={{
              fontSize: "2rem",
              color: "whitesmoke",
            }}
          />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            color: "whitesmoke",
            fontWeight: "bold",
            textAlign: "center",
            display: { xs: "none", lg: "block" },
          }}
        >
          Quick Chat
        </Typography>
      </Box>

      {/* Conversation List */}
      <Box
        sx={{
          height: "100%",

          display: "flex",
          flexDirection: "column",
          justifyContent: conversations.length > 0 ? "flex-start" : "center",
          // alignItems: "center",
        }}
      >
        <List
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
          }}
        >
          {Array.isArray(conversations) ? (
            conversations.length > 0 ? (
              conversations
                .slice(0, 5)
                .map((conversation) => (
                  <UserTabs
                    conversation={conversation}
                    key={conversation._id}
                    handleOpen={handleOpen}
                  />
                ))
            ) : (
              <EmptyChatList />
            )
          ) : (
            <ListLoading />
          )}
        </List>
      </Box>

      {/* Chat Drawer */}
      <QuickMessages open={open} handleClose={handleClose} />
    </Drawer>
  );
};

export default LGQuickChat;
