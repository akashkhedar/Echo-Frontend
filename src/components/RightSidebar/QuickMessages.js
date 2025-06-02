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
  bgcolor: "#1e1e2f",
  boxShadow: 24,
  borderRadius: 2,
  // p: 2,
  height: 450,
  display: "flex",
  flexDirection: "column",
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
          <Messages />
          <ChatInput />
        </Box>
      </Fade>
    </Modal>
  );
};

export default QuickMessages;
