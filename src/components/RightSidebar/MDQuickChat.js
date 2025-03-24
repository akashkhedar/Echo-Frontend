import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { IconButton, Typography } from "@mui/material";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";

const users = [
  { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
  { name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=4" },
  { name: "Michael Brown", avatar: "https://i.pravatar.cc/150?img=5" },
];

const MDQuickChat = () => {
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
      </Box>
      <List sx={{ overflow: "hidden" }}>
        {users.map((user, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ marginY: "0.5rem" }}>
              <ListItemButton sx={{ display: "flex", gap: 2 }}>
                <Avatar src={user.avatar} alt={user.name} />
              </ListItemButton>
            </ListItem>
            {index !== users.length - 1 && (
              <Divider variant="middle" sx={{ bgcolor: "secondary.light" }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};
export default MDQuickChat;
