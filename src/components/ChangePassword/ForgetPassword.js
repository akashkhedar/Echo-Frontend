import { Box, Grid, Slide, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideImg from "../../assets/ForgetPassword.jpg";
import Gradient from "../../assets/ForgetPasswordGradient.jpg";
import EmailStep from "./Steps/EmailStep";

const ForgetPassword = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${Gradient})`,
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
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "#191919",
            padding: { xs: 4, sm: 6 },
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "90vh",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reset your credentials to continue using Echo
            </Typography>
          </Box>
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
                <EmailStep />
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
      </Grid>
    </Box>
  );
};

export default ForgetPassword;
