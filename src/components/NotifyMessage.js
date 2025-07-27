import React, { forwardRef } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NotifyMessage = forwardRef(function NotifyMessage(
  { username, closeSnackbar, ...props },
  ref
) {
  return (
    <Card ref={ref} sx={{ minWidth: 250, p: 2 }} {...props}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px !important",
        }}
      >
        <Typography variant="subtitle1">
          📩 Message from {username || "Someone"}
        </Typography>
        <IconButton onClick={closeSnackbar} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  );
});

export default NotifyMessage;
