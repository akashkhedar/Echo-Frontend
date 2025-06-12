import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import axiosInstance from "../../axiosInstance";

const InvalidResetToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null); // null = loading, false = invalid, true = valid

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axiosInstance.get(
          `/auth/verify-reset-token/${token}`
        );
        if (res.data?.valid) {
          setIsValid(true);
          navigate(`/update-password/${token}`);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  if (isValid === null) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#0a0f2c"
      >
        <CircularProgress sx={{ color: "violet" }} />
      </Box>
    );
  }

  if (isValid === false) {
    return (
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bgcolor="#0a0f2c"
        color="white"
        p={3}
      >
        <img
          src="https://www.svgrepo.com/show/382106/astronaut-space.svg"
          alt="Astronaut"
          width="200"
          height="200"
          style={{ marginBottom: "20px" }}
        />
        <Typography variant="h4" sx={{ color: "violet", mb: 2 }}>
          Invalid or Expired Token
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, color: "lightgray" }}>
          The reset link you used is either invalid or has expired. Please try
          requesting a new one.
        </Typography>
      </Box>
    );
  }

  return null;
};

export default InvalidResetToken;
