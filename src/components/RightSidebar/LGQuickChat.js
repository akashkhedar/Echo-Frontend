import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import { IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import * as React from "react";
import { useSelector } from "react-redux";
import QuickMessages from "./QuickMessages";
import UserTabs from "./UserTabs";

const LGQuickChat = () => {
  const conversations = useSelector((state) => state.convo);

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
          height: "calc(100vh - 20.5rem)", // Adjust height to exclude navbar
          marginTop: "4rem", // Push down to align below navbar
          width: { md: "4rem", lg: "14rem" },
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "key",
          alignItems: "center",
          padding: "0.5rem",
          gap: 1,
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
          }}
        >
          Quick Chat
        </Typography>
      </Box>
      <List sx={{ overflow: "hidden" }}>
        {conversations.slice(0.5).map((conversation) => (
          <UserTabs
            conversation={conversation}
            key={conversation._id}
            handleOpen={handleOpen}
          />
        ))}
      </List>
      <QuickMessages open={open} handleClose={handleClose} />
    </Drawer>
  );
};

export default LGQuickChat;
