import * as React from "react";
import { Modal, Box, Backdrop, Fade } from "@mui/material";
import ChatHeader from "../ChatPage/ChatHeader";
import Messages from "../ChatPage/Messages";
import ChatInput from "../ChatPage/ChatInput";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  height: 450,
  bgcolor: "#1e1e2f",
  boxShadow: 24,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // Ensures no extra scroll
};

const QuickMessages = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <ChatHeader />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Messages />
          </Box>

          <Box
            sx={{
              borderTop: "1px solid #333",
              padding: "8px 12px",
              bgcolor: "#1e1e2f",
              flexShrink: 0,
            }}
          >
            <ChatInput />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default QuickMessages;
