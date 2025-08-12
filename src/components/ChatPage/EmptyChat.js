import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Box, Typography } from "@mui/material";
import React from "react";

const EmptyChat = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 }, // More padding for larger screens
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%", // full width on mobile
            sm: "80%",
            md: "60%",
            lg: "40%",
          },
          maxWidth: "500px", // prevent too wide on large screens
          borderRadius: 3,
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(250deg, rgb(37, 47, 78), rgb(21, 84, 60))",
          color: "#fff",
          textAlign: "center",
          border: "2px solid rgba(107, 152, 118, 0.78)",
        }}
      >
        <ChatBubbleOutlineIcon
          sx={{
            fontSize: { xs: 48, sm: 64, md: 80 },
            color: "#B388FF",
            mb: { xs: 1.5, sm: 2 },
          }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.6rem" },
          }}
        >
          No Chat Selected
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.7,
            mt: 1,
            fontSize: { xs: "0.85rem", sm: "1rem" },
            maxWidth: "90%", // keeps text from stretching too much
          }}
        >
          Select a conversation to start messaging.
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyChat;
