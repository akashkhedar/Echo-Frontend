import { Box, Grid, Slide, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideImg from "../../assets/ForgetPassword.jpg";
import EmailStep from "./Steps/EmailStep";

const ForgetPassword = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(
    circle at 30% 50%, 
    rgba(255, 150, 120, 0.25) 0%,    /* warm sunset orange glow */
    rgba(255, 180, 200, 0.25) 20%,   /* soft pink clouds */
    transparent 50%
),
linear-gradient(
    270deg,
    rgba(255, 150, 120, 0.9) 0%,     /* sunset orange */
    rgba(255, 180, 200, 0.85) 15%,   /* soft warm pink */
    rgba(180, 80, 150, 0.85) 35%,    /* transition purple-pink */
    rgba(80, 40, 130, 0.85) 55%,     /* deep purple */
    rgba(40, 20, 90, 0.9) 75%,       /* dark violet night sky */
    rgba(10, 10, 40, 0.95) 100%      /* nearly black starfield */
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
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "#100f0fff",
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
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Forgot
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="#d900ffff"
              >
                Password??
              </Typography>
            </Box>
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
            bgcolor: "#191919",
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
