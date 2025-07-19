import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../../../axiosInstance";
import { useState } from "react";

const EmailStep = () => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState("");
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/auth/forget-password", {
        userInfo: detail,
      });
    } catch (error) {
    } finally {
      setLoading(false);
      setDetail("");
    }
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
        sx={{
          mt: 3,
          bgcolor: "violet",
          "&.Mui-disabled": {
            backgroundColor: "rgba(102, 14, 125, 1)", // darker blue when loading
            color: "#fff",
          },
          backgroundColor: "#ad19d2ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#82109eff",
          },
        }}
        onClick={handleSubmit}
        disabled={!detail && !loading}
        loading={loading}
        loadingPosition="end"
      >
        Send Code
      </Button>
    </Box>
  );
};

export default EmailStep;
