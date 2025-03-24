import { Box, Typography } from "@mui/material";
import React from "react";

const NoNotification = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50%",
      }}
    >
      <Box
        sx={{
          backgroundColor: " #222831",
          padding: "3rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ color: "rgb(227, 241, 253)" }}
        >
          No New Notification at the moment!
        </Typography>
      </Box>
    </Box>
  );
};

export default NoNotification;
