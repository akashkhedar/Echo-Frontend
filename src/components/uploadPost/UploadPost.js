import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import UploadBox from "./UploadBox";

const UploadPost = ({ open, handleClose }) => {
  return (
    <Modal
      aria-labelledby="upload-post-title"
      aria-describedby="upload-post-description"
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
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
            height: "100dvh",
            width: "100dvh",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 1,
            outline: "none", // <- this removes the border/focus ring
          }}
        >
          <UploadBox handleClose={handleClose} />
        </Box>
      </Fade>
    </Modal>
  );
};

export default UploadPost;
