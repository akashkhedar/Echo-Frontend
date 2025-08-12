import React, { forwardRef } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";

const NotifyCall = forwardRef(
  ({ callerName, type, handleAcceptCall, handleDeclineCall }, ref) => {
    return (
      <Card
        ref={ref}
        sx={{
          minWidth: 280,
          bgcolor: "#0b0d2a",
          color: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <CardContent sx={{ pb: "8px !important" }}>
          <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
            📞 {callerName || "Unknown"} is calling…
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 1.5,
            }}
          >
            <IconButton
              onClick={handleAcceptCall}
              sx={{
                bgcolor: "success.main",
                color: "white",
                "&:hover": { bgcolor: "success.dark" },
              }}
            >
              <CallIcon />
            </IconButton>
            <IconButton
              onClick={handleDeclineCall}
              sx={{
                bgcolor: "error.main",
                color: "white",
                "&:hover": { bgcolor: "error.dark" },
              }}
            >
              <CallEndIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

export default NotifyCall;
