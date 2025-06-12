import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../../../axiosInstance";
import { useState } from "react";

const EmailStep = () => {
  const [detail, setDetail] = useState("");
  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/auth/forget-password", {
        userInfo: detail,
      });
    } catch (error) {}
  };
  return (
    <Box>
      <Typography variant="h6" color="white" mb={2}>
        Enter your detail
      </Typography>
      <TextField
        fullWidth
        type="text"
        label="Email/Username"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        variant="outlined"
        sx={{
          input: { color: "white" },
          label: { color: "lightgray" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "violet" },
            "&.Mui-focused fieldset": { borderColor: "violet" },
          },
        }}
      />
      <Button
        variant="contained"
        sx={{ mt: 3, bgcolor: "violet" }}
        onClick={handleSubmit}
        disabled={!detail}
      >
        Send Code
      </Button>
    </Box>
  );
};

export default EmailStep;
