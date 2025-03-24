import { Info, Phone, Videocam } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const ChatHeader = () => {
  const user = useSelector((state) => state.chat);
  return (
    <Box
      sx={{
        padding: 1,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1E1E2F",
        color: "whitesmoke",
        height: "2.6rem",
      }}
    >
      {/* User Info */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={user.chatProfileImage}
          alt={user.chatUserName}
          sx={{ border: "2px solid rgba(255, 255, 255, 0.1)" }}
        />
        <Box sx={{ marginLeft: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "whitesmoke" }}
          >
            {user.chatName}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgb(82, 203, 71)" }}>
            Online now
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box>
        <IconButton
          sx={{
            color: "whitesmoke",
          }}
        >
          <Phone sx={{ fontSize: 30 }} />
        </IconButton>
        <IconButton
          sx={{
            color: "whitesmoke",
          }}
        >
          <Videocam sx={{ fontSize: 30 }} />
        </IconButton>
        <IconButton
          sx={{
            color: "whitesmoke",
          }}
        >
          <Info sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;
