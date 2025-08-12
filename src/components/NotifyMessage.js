import React, { forwardRef } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NotifyMessage = forwardRef(function NotifyMessage(
  { username, closeSnackbar, ...props },
  ref
) {
  return (
    <Card
      ref={ref}
      elevation={3}
      sx={{
        minWidth: 240,
        bgcolor: "#4c3b90ff",
        borderRadius: 2,
        px: 1.5,
        py: 0.5,
      }}
      {...props}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "4px !important",
          px: "4px !important",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "white", mr: 1 }}
        >
          {username || "Someone"} sent you a message
        </Typography>

        <IconButton
          onClick={closeSnackbar}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  );
});

export default NotifyMessage;
