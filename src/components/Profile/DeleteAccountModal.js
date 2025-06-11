import * as React from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: " #1e1e2f",
  border: "1px solid #444",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: "white",
};

const DeleteAccountModal = ({ delModal, closeDelModal }) => {
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/delete-account", {
        password: password,
      });
      if (res.status === 200) {
        navigate("/signup");
      }
    } catch (error) {}
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={delModal}
      onClose={closeDelModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={delModal}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" gutterBottom>
            Confirm Account Deletion
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please confirm your password to permanently delete your account.
            This action cannot be undone.
          </Typography>

          <TextField
            fullWidth
            type="password"
            label="Enter your password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error}
            sx={{
              mb: 2,
              input: { color: "white" },
              label: { color: "lightgray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
                "&:hover fieldset": { borderColor: "violet" },
                "&.Mui-focused fieldset": { borderColor: "violet" },
              },
            }}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              onClick={closeDelModal}
              sx={{
                textTransform: "none",
                color: "white",
                borderColor: "gray",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                textTransform: "none",
                backgroundColor: "#c62828",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteAccountModal;
