import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Button, Typography, Box } from "@mui/material";

const NotifyCall = ({
  callerId,
  callerName,
  type,
  handleAcceptCall,
  handleDeclineCall,
  socket,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const key = enqueueSnackbar(`${callerName} is calling...`, {
      persist: true,
      content: (key) => (
        <Box
          sx={{
            backgroundColor: "#333",
            color: "white",
            padding: 2,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography>{callerName} is calling...</Typography>
          <Box>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1 }}
              onClick={() => {
                closeSnackbar(key);
                handleAcceptCall();
              }}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                socket.emit("callRejected", {
                  callerId,
                  reason: "declined",
                });
                closeSnackbar(key);
                handleDeclineCall?.();
              }}
            >
              Decline
            </Button>
          </Box>
        </Box>
      ),
    });

    const timeout = setTimeout(() => {
      closeSnackbar(key);
      socket.emit("callRejected", {
        callerId,
        reason: "timeout",
      });
    }, 30000);

    return () => clearTimeout(timeout);
  }, [
    callerId,
    callerName,
    closeSnackbar,
    enqueueSnackbar,
    handleAcceptCall,
    handleDeclineCall,
    socket,
  ]);

  return null;
};

export default NotifyCall;
