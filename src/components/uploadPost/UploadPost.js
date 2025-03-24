import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import React from "react";
import UploadBox from "./UploadBox";

const UploadPost = ({ open, handleClose }) => {
  return (
    <Modal
      aria-labelledby="upload-post-title"
      aria-describedby="upload-post-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            background: "rgba(26, 12, 12, 0.2)",
            backdropFilter: "blur(10px)",
            " -webkit-backdrop-filter": "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UploadBox handleClose={handleClose} />
        </Box>
      </Fade>
    </Modal>
  );
};

export default UploadPost;
