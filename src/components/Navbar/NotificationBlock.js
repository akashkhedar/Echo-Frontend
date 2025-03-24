import { Box, Typography } from "@mui/material";
import * as React from "react";

const NotificationBlock = ({ notification }) => {
  return (
    <Box
      key={notification.id}
      sx={{
        backgroundColor: "#222831",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        boxShadow: notification.isRead
          ? "none"
          : "0px 4px 10px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ color: "#90caf9" }}
      >
        {notification.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#cfd8dc" }}>
        {notification.message}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "#9e9e9e", display: "block", marginTop: "0.5rem" }}
      >
        {new Date(notification.timestamp).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default NotificationBlock;
