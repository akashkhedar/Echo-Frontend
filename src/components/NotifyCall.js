import React, { forwardRef } from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";

const NotifyCall = forwardRef(
  ({ callerName, type, handleAcceptCall, handleDeclineCall }, ref) => {
    return (
      <Card ref={ref} sx={{ minWidth: 300, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">{callerName} is calling...</Typography>
          <Typography variant="body2">Type: {type}</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleAcceptCall}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeclineCall}
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default NotifyCall;
