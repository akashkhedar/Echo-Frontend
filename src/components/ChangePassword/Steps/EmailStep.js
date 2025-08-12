import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../../axiosInstance";

const EmailStep = () => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/forget-password", {
        userInfo: detail,
      });

      if (res.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
      }
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    } finally {
      setLoading(false);
      setDetail("");
    }
  };

  return (
    <Box>
      {isSuccess && (
        <Alert severity="success" sx={{ width: "100%" }}>
          Please check your mail for password reset link
        </Alert>
      )}

      {isError && <Alert severity="error">User not found</Alert>}

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
        sx={{
          mt: 3,
          bgcolor: "violet",
          backgroundColor: "#2000c1ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#0a0763ff",
          },
          "&.Mui-disabled": {
            backgroundColor: "#0a0763ff", // darker blue when loading
            color: "#fff",
          },
        }}
        loading={loading}
        loadingPosition="end"
        onClick={handleSubmit}
        disabled={!detail}
      >
        {loading ? "Sending..." : "Send Code"}
      </Button>
    </Box>
  );
};

export default EmailStep;
