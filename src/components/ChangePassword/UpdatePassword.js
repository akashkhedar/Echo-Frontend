import { Alert, Box, Grid, Slide, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideImg from "../../assets/UpdatePassword.jpg";
import NewPasswordStep from "./Steps/NewPasswordStep";
import { useState } from "react";

const UpdatePassword = () => {
  const [error, setError] = useState(false);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(
    circle at 70% 50%, 
    rgba(255, 50, 200, 0.25) 0%,    /* neon magenta glow */
    rgba(0, 180, 255, 0.25) 20%,    /* cyan-blue glow */
    transparent 50%
),
linear-gradient(
    270deg,
    rgba(5, 5, 15, 0.95) 0%,        /* deep blackish blue for left side */
    rgba(15, 10, 40, 0.9) 20%,      /* dark space blue */
    rgba(30, 20, 80, 0.85) 40%,     /* deeper blue-violet */
    rgba(80, 30, 130, 0.85) 60%,    /* rich purple */
    rgba(150, 0, 180, 0.85) 75%,    /* magenta highlight */
    rgba(255, 60, 180, 0.8) 90%,    /* neon pink glow */
    rgba(0, 170, 255, 0.85) 100%    /* bright cyan edge */
)`,
        backgroundBlendMode: "screen, overlay",
        backgroundSize: "cover",
        color: "white",
      }}
    >
      <Grid
        container
        sx={{
          height: "87vh",
          width: { xs: "90%", sm: "80%", md: "70%" },
          boxShadow: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "2px solid #333",
        }}
      >
        {" "}
        <Grid
          item
          md={6}
          sx={{
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${SideImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        ></Grid>
        {/* Left Side */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "#121212ff",
            padding: { xs: 4, sm: 6 },
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "90vh",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="#d900ffff"
              >
                Update
              </Typography>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Password!
              </Typography>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Reset your credentials to continue using Echo
            </Typography>
          </Box>
          {error && (
            <Alert severity="error">Session expired, please try again!</Alert>
          )}
          <Box
            mt={1}
            sx={{
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            <Slide in={true} mountOnEnter unmountOnExit>
              <Box>
                <NewPasswordStep setError={setError} />
              </Box>
            </Slide>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" align="center" pb={1}>
              Remembered your password?{" "}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Log in
                </Link>
              </Typography>
            </Typography>
          </Box>
        </Grid>
        {/* Right Side */}
      </Grid>
    </Box>
  );
};

export default UpdatePassword;
