import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../../../axiosInstance";
import { useState } from "react";

const EmailStep = ({ setActiveStep, setDirection }) => {
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/forget-password", {
        email: email,
      });
      if (res) {
        console.log(res);
        setDirection("left");
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {}
  };
  return (
    <Box>
      <Typography variant="h6" color="white" mb={2}>
        Enter your registered email/Username
      </Typography>
      <TextField
        fullWidth
        type="email"
        label="Email/Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        disabled={!email}
      >
        Send Code
      </Button>
    </Box>
  );
};

export default EmailStep;
