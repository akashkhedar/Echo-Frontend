import { Box, Typography } from "@mui/material";
import React from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const NewMessage = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "10rem",
          width: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          py: 3,
          justifyContent: "center",
          background: "linear-gradient(250deg,rgb(37, 47, 78),rgb(21, 84, 60))", // Dark blue to purple
          color: "#fff",
          textAlign: "center",
          border: "2px solid rgba(107, 152, 118, 0.78)",
          zIndex: 1,
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: "#B388FF", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">
          No messages yet.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, mt: 1 }}>
          Say hello! 👋
        </Typography>
      </Box>
    </Box>
  );
};

export default NewMessage;
