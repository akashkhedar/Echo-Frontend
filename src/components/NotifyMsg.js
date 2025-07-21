import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Box, Typography } from "@mui/material";

const NotifyMsg = ({ sender }) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    enqueueSnackbar(`${sender} sent you a message.`, {
      variant: "info",
      autoHideDuration: 4000,
      content: (key) => (
        <Box
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography>{sender} sent you a message.</Typography>
        </Box>
      ),
    });
  }, [enqueueSnackbar, sender]);

  return null;
};

export default NotifyMsg;
