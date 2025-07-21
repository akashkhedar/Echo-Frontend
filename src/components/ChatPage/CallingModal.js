import CallEndIcon from "@mui/icons-material/CallEnd";
import { Avatar, Backdrop, Box, IconButton, Modal } from "@mui/material";
import socket from "../../utils/socket";

const CallingModal = ({ calleeImage, open, onClose, callerId, calleeId }) => {
  const handleClose = () => {
    socket.emit("endCall", { callerId, calleeId });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: "rgba(0,0,0,0.8)" },
        },
      }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#121212", // Dark background for modal card
            padding: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 6,
            minWidth: 250,
          }}
        >
          <Avatar
            src={calleeImage}
            alt="Callee"
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              boxShadow: 4,
              mb: 4,
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "#d32f2f" },
              width: 60,
              height: 60,
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default CallingModal;
